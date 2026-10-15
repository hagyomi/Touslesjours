import { StrictMode, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../index.css';

const initializeApp = () => {
    const root = createRoot(document.getElementById('root'));

    root.render(
        createElement(StrictMode, null, createElement(App)),
    );
};

(() => {
    initializeApp();
})();
