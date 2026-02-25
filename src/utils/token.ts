export const getToken = (): string | null =>
    localStorage.getItem("access_token");
  
  export const setToken = (token: string): void =>
    localStorage.setItem("access_token", token);
  
  export const removeToken = (): void =>
    localStorage.removeItem("access_token");
  
  export const getRefreshToken = (): string | null =>
    localStorage.getItem("refresh_token");
  
  export const setRefreshToken = (token: string): void =>
    localStorage.setItem("refresh_token", token);
  
  export const removeRefreshToken = (): void =>
    localStorage.removeItem("refresh_token");