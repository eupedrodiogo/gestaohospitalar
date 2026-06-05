import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof document !== 'undefined') {
  window.addEventListener('error', (e) => {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<div style="color:red;padding:20px;background:black;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;"><h1>Error Details</h1><pre>${e.message}\n${e.error?.stack}</pre></div>`;
    }
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20); // 20ms brief vibration
      }
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
