// src/services/axios/secure.api.ts
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';

/* -------------------------------------------------------------------------- */
/*  Global Session Expired Handler (AuthContext can register callback)       */
/* -------------------------------------------------------------------------- */

let onSessionExpired: () => void = () => {};

export const registerOnRefreshFail = (cb: () => void) => {
  onSessionExpired = cb;
};

/* -------------------------------------------------------------------------- */
/*  Axios instance for secure requests (access token required)               */
/* -------------------------------------------------------------------------- */

const secureApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*  Axios instance only for refreshToken (no Authorization needed)           */
/* -------------------------------------------------------------------------- */

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // NECESARIO para enviar la cookie refresh_token
});

/* -------------------------------------------------------------------------- */
/*  Request interceptor: Inject access token                                 */
/* -------------------------------------------------------------------------- */

secureApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const latestToken = localStorage.getItem('access_token');
  if (latestToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${latestToken}`;
  }
  return config;
});

/* -------------------------------------------------------------------------- */
/*  Response interceptor: Refresh token on 401                               */
/* -------------------------------------------------------------------------- */

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

secureApi.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post('/auth/refreshToken');
        const newAccessToken: string = res.data.accessToken;

        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return secureApi(originalRequest as AxiosRequestConfig);
      } catch (refreshError) {
        onSessionExpired(); // Logout desde AuthContext
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default secureApi;
