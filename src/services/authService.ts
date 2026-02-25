import { AuthResponse, LoginDTO } from "../@types/auth";
import { api } from "../api/axios";
import { setToken } from "../utils/token";

export const AuthService = {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);

    const { accessToken } = response.data;

    setToken(accessToken);

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
