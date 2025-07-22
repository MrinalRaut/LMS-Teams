// Filename: src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { Provider } from 'react-redux';
// Corrected import path to point directly to redux.js
import { store } from './store/redux.js'; // Use named import if 'store' is a named export from redux.js

import { setAuthFromLocalStorage } from './features/auth/authSlice';

import { Toaster } from 'react-hot-toast';

store.dispatch(setAuthFromLocalStorage());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </StrictMode>,
);
