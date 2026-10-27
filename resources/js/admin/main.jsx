import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AdminApp from './AdminApp';

const container = document.getElementById('admin-root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <BrowserRouter basename="/admin">
                <AdminApp />
            </BrowserRouter>
        </React.StrictMode>
    );
}
