import { api } from "../api/axios";

export const getUserData = async () => {
  const response = await api.get(`/usuarios/me`);
  return response.data;
};

export const getMunicipios = async () => {
  const response = await api.get(`/municipios`);
  return response.data;
};

export const getEmpreendimentos = async () => {
  const response = await api.get(`/empreendimentos?page=0&limit=10`);
  return response.data;
};

export const getBeneficiarios = async ({
  page = 0,
  limit = 10,
  filter,
  param,
}: {
  page: number;
  limit: number;
  filter: string;
  param: string;
}) => {
  const response = await api.get(
    `/beneficiarios?page=${page}&limit=${limit}&${filter}=${param}`
  );
  return response.data;
};

export const getFaixas = async () => {
  const response = await api.get(`/faixas?page=0&limit=10`);
  return response.data;
};

export const createMunicipio = async (payload: { nome: string }) => {
  const response = await api.post(`/municipios`, payload);
  return response.data;
};

export const createHierarquizacao = async (payload: {
  idEmpreendimento: string;
}) => {
  const response = await api.post(`/sorteio`, payload);
  return response.data;
};

export const createEmpreendimento = async (payload: any) => {
  const response = await api.post(`/empreendimentos`, payload);
  return response.data;
};

export const createBeneficiario = async (payload: any) => {
  const response = await api.post(`/beneficiarios`, payload);
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

export const deleteEmpreendimento = async ({ id }: { id: string }) => {
  const response = await api.delete(`/empreendimentos/${id}`);
  return response.data;
};

export const deleteUser = async ({ id }: { id: string }) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};
