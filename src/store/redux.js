// Filename: src/store/redux.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import teamsReducer from '../features/teams/teamsSlice'; // Import the teams reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teams: teamsReducer, // Add the teams reducer here
  },
});
