// src/main.jsx (ou main.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // 1. Garanta que o caminho de importação esteja correto
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
);
