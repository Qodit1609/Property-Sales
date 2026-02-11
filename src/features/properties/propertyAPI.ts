import axios from "axios";

const BASE_URL = "http://localhost:5000/api/properties";

export const fetchPropertiesAPI = async (page: number, limit: number) => {
  const res = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`);
  return res.data.data;
};

export const fetchPropertyByIdAPI = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data.data; // IMPORTANT: backend returns inside data
};
