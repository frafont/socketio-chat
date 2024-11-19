import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './SocketContext';  // Importa il SocketProvider

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Avvolgi l'app con SocketProvider per gestire il socket a livello globale */}
    <SocketProvider>
      <App />
    </SocketProvider>
  </React.StrictMode>
);

reportWebVitals();