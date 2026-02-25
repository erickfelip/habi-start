import { api } from "../api/axios";

export const getMunicipios = async () => {
  const response = await api.get(`/municipios`);
  return response.data;
};

export const createMunicipio = async (payload: { nome: string }) => {
  const response = await api.post(`/municipios`, payload);
  return response.data;
};

export const deleteMunicipio = async ({ id }: { id: string }) => {
  const response = await api.delete(`/municipios/${id}`);
  return response.data;
};
