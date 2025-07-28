// src/services/axios/auth.api.ts
import axios from "axios";

// Ensure fallback only if the env var is empty or missing
const baseURL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:3000/api";

const authApi = axios.create({
  baseURL,
  withCredentials: true, // Allows sending HttpOnly cookies like refresh_token
});

export default authApi;
