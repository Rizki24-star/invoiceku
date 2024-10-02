import axios from "axios";

const BASE_URL = "http://localhost:3300/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const get = async (endpoint: string, params?: object) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async (endpoint: string, data: object) => {
  try {
    const response = await api.post(endpoint, { ...data });
    return response.data;
  } catch (error) {
    throw error;
  }
};
