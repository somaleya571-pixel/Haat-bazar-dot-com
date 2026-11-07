import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './sw-register';
import { initBrowserFixes } from './utils/browserCompatibility';

// Initialize cross-browser and mobile in-app webview viewport fixes
initBrowserFixes();

// Register Service Worker for auto-activation & instant cache purge
registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);

