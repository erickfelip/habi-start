import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  // removeToken,
  // removeRefreshToken,
} from "../utils/token";

/* -------------------------------------------------------------------------- */
/*                              CONFIGURAÇÃO BASE                             */
/* -------------------------------------------------------------------------- */

export const api = axios.create({
  baseURL: "https://sga.startconsultorianet.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* -------------------------------------------------------------------------- */
/*                            CONTROLE DE REFRESH                             */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });

  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                        VERIFICAÇÃO DE EXPIRAÇÃO                            */
/* -------------------------------------------------------------------------- */

interface TokenPayload {
  exp: number;
}

// 12 min antes de expirar
const isTokenExpiringSoon = (token: string, bufferSeconds = 720): boolean => {
  const decoded = jwtDecode<TokenPayload>(token);
  const currentTime = Date.now() / 1000;

  return decoded.exp - currentTime < bufferSeconds && decoded.exp > currentTime;
};

/* -------------------------------------------------------------------------- */
/*                            FUNÇÃO DE REFRESH                               */
/* -------------------------------------------------------------------------- */

const refreshAccessToken = async (): Promise<string> => {
  const accessToken = getToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new Error("Nenhum token encontrado");
  }

  const response = await axios.post(
    "https://sga.startconsultorianet.com/auth/refresh",
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    response.data;

  setToken(newAccessToken);
  setRefreshToken(newRefreshToken);

  return newAccessToken;
};

/* -------------------------------------------------------------------------- */
/*                           INTERCEPTOR DE REQUEST                           */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (!token) return config;

    if (isTokenExpiringSoon(token)) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err, null);
          // removeToken();
          // removeRefreshToken();
          // window.location.href = "/login";
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(config);
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/*                           INTERCEPTOR DE RESPONSE                          */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        // removeToken();
        // removeRefreshToken();
        // window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
