// Filename: src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance'; // Use the custom axios instance

const API_BASE_URL = '/auth'; // Base URL is now handled by axiosInstance

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/login`, { email, password }); // Use axiosInstance
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}. Please try again.`);
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/register`, { name, email, password }); // Use axiosInstance
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}. Please try again.`);
      }
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/forgot-password`, { email }); // Use axiosInstance
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to send password reset link.');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your internet connection.');
      } else {
        return rejectWithValue(`Error: ${error.message}.`);
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromLocalStorage: (state) => {
      const token = localStorage.getItem('userToken');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('userToken');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.error = null;
        if (action.payload.token) {
          localStorage.setItem('userToken', action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload || 'An unknown error occurred during login.';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unknown error occurred during registration.';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unknown error occurred during password reset request.';
      });
  },
});

export const { setAuthFromLocalStorage, logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
