import api from "../api/axios";

export const authService = {
  // Login do usuário
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    // Os tokens já são salvos automaticamente como cookies HttpOnly pelo backend
    return response.data;
  },

  // Logout do usuário
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Verifica se o usuário está autenticado
//   async checkAuth() {
//     try {
//       const response = await api.get("/auth/me");
//       return response.data;
//     } catch (error) {
//       return null;
//     }
//   },

  // Refresh do token
  async refreshToken() {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};
