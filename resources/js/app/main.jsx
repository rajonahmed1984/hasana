import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { App } from './App';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <BrowserRouter>
                <ModalProvider>
                    <App />
                </ModalProvider>
            </BrowserRouter>
        </StrictMode>
    );
}
