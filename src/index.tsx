import ReactDOM from 'react-dom/client';
import App from './App';
import "./styles/styles.css" // ✅잊어 버리즤마
import { RecoilRoot } from 'recoil';
import React from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
