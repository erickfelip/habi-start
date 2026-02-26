import { api } from "../api/axios";

export const getUserData = async () => {
  const response = await api.get(`/usuarios/me`);
  return response.data;
};

export const getMunicipios = async () => {
  const response = await api.get(`/municipios`);
  return response.data;
};

export const createMunicipio = async (payload: { nome: string }) => {
  const response = await api.post(`/municipios`, payload);
  return response.data;
};

export const createUser = async (payload: {
  primeiroNome: string;
  segundoNome: string;
  cargo: string;
  idMunicipio: string;
  email: string;
  senha: string;
}) => {
  const response = await api.post(`/usuarios`, payload);
  return response.data;
};

export const getUsers = async (idMunicipio: string) => {
  const response = await api.get(`/usuarios?idMunicipio=${idMunicipio}`);
  return response.data;
};

export const deleteMunicipio = async ({ id }: { id: string }) => {
  const response = await api.delete(`/municipios/${id}`);
  return response.data;
};


export const deleteUser = async ({ id }: { id: string }) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};