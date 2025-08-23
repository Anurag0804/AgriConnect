// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error("No #root element found in public/index.html");
}
createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
