import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const authStore = useAuthStore();

authStore.getLocalData();

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: `${process.env.API}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const { token } = authStore;

  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function refreshAuthToken(requestAgain?: boolean) {
  const { refreshToken } = authStore;

  if (refreshToken === null) {
    return;
  }

  if (requestAgain === undefined || requestAgain === null || !requestAgain) {
    return;
  }

  const response = await api.post('/auth/refresh/', {
    refresh: refreshToken,
  });

  if (response.status === 200) {
    authStore.setToken(response.data.access);
  } else {
    authStore.logout(true);
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401
      && originalRequest.retryWithRefreshToken !== true) {
      originalRequest.retryWithRefreshToken = true;

      try {
        await refreshAuthToken(originalRequest.retryWithRefreshToken);
      } catch (e) {
        return Promise.reject(e);
      }

      originalRequest.headers.Authorization = `Bearer ${authStore.token}`;

      return api(originalRequest);
    }

    if (error.response && error.response.status === 401 && originalRequest.retryWithRefreshToken) {
      authStore.logout(true);
    }

    return Promise.reject(error);
  },
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
