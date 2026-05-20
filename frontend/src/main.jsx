import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 100,
});
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
