import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import React from "react";
const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verifica autenticação ao carrega
  //   useEffect(() => {
  //     checkAuthentication()
  //   }, []);

  //   const checkAuthentication = async () => {
  //     try {
  //       const userData = await authService.checkAuth();
  //       setUser(userData);
  //     } catch (error) {
  //       setUser(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    // APOS FAZER LOGIN DEVE SER BUSCADO EM UM ENDPOINT OS DADOS DO USUARIO
    // E STAR NO ESTADO "USER"
    setUser(data);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
