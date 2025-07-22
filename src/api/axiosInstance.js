// Filename: src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.aartian.online/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// A function to set up interceptors, taking the store as an argument
export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        import('../features/auth/authSlice').then(({ logout }) => {
          store.dispatch(logout());
        });
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance; // Still export the instance itself for direct use
