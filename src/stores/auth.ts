import { defineStore } from 'pinia';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  invalidToken: boolean;
}

const LOCAL_STORAGE_KEY = 'user_auth';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    email: null,
    invalidToken: false,
  }),

  getters: {
    isLoggedIn: (state) => state.token !== null,
  },

  actions: {
    login(data: { token: string; refresh: string, email: string }) {
      this.token = data.token || null;
      this.refreshToken = data.refresh || null;
      this.email = data.email || null;

      this.setLocalData();
      this.router.push('/');
    },
    getLocalData() {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (localData) {
        const data = JSON.parse(localData);
        this.token = data.token;
        this.refreshToken = data.refreshToken;
        this.email = data.email;
      }
    },
    setLocalData() {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state));
    },
    setToken(token: string) {
      this.token = token;
      this.setLocalData();
    },
    logout(invalidToken = false) {
      this.token = null;
      this.refreshToken = null;
      this.email = null;
      this.invalidToken = invalidToken;

      localStorage.removeItem(LOCAL_STORAGE_KEY);

      this.router.push('/login');
    },
  },
});
