import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/styles.css" // ✅잊어 버리즤마

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);


