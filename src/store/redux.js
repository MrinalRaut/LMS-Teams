// src/store/redux.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Ensure this path is correct relative to src/store/redux.js

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here if you create more slices later
  },
});
