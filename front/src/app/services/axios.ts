// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Assurez-vous que ce chemin correspond à votre backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Gérer les erreurs globales ici
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
