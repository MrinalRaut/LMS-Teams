import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Redux imports
import { Provider } from 'react-redux';
import { store } from './store/redux.js'; // Ensure this path is correct relative to main.jsx

// Toast imports
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </Provider>
  </StrictMode>,
);
