import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { InventoryProvider } from './contexts/InventoryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </AuthProvider>
  </StrictMode>,
);
