import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000, // 60s — blockchain tx can take time
});

export const uploadCertificate = async (formData) => {
  const response = await api.post("/certificates/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const verifyCertificate = async (formData) => {
  const response = await api.post("/certificates/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default api;
