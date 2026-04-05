import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
} from "../utils/token";

interface AuthContextData {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [refreshTokenState, setRefreshTokenState] = useState<string | null>(
    null
  );

  useEffect(() => {
    const storedAccess = getToken();
    const storedRefresh = getRefreshToken();

    if (storedAccess && storedRefresh) {
      setAccessTokenState(storedAccess);
      setRefreshTokenState(storedRefresh);
    }
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setRefreshToken(refreshToken);

    setAccessTokenState(accessToken);
    setRefreshTokenState(refreshToken);
  };

  const logout = () => {
    removeToken();
    removeRefreshToken();

    setAccessTokenState(null);
    setRefreshTokenState(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessTokenState,
        refreshToken: refreshTokenState,
        isAuthenticated: !!accessTokenState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
