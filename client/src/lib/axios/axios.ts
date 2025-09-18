import axios from 'axios';
import { userStore } from '../../state/global';

const api = axios.create();

type AxiosRequestConfig = Parameters<typeof api.interceptors.request.use>[0];

const requestInterceptor: AxiosRequestConfig = (config) => {
  const { token } = userStore.getState();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  } else {
    config.headers = config.headers || {};
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
};

api.interceptors.request.use(requestInterceptor);

export default api;
