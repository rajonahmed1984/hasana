import React, { StrictMode } from 'react';
import '@fontsource/hind-siliguri/400.css';
import '@fontsource/hind-siliguri/500.css';
import '@fontsource/hind-siliguri/600.css';
import '@fontsource/hind-siliguri/700.css';
import '@fontsource/amiri/400.css';
import '@fontsource/amiri/700.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { App } from './App';
import { registerServiceWorker, autoDownloadForOffline } from './services/offlineStore';
import { SplashScreen } from '@capacitor/splash-screen';
import { isNative } from './native';

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

    // Android app: keep the native splash until the first screen has painted, then fade it out
    // (capacitor.config.json hides it after 8 s anyway, e.g. if loading fails)
    if (isNative()) {
        requestAnimationFrame(() => requestAnimationFrame(() => SplashScreen.hide().catch(() => {})));
    }
}

// Offline support: cache the app after it has loaded, then (in the Android app) fetch the Quran & duas for offline reading
window.addEventListener('load', () => {
    registerServiceWorker();
    setTimeout(autoDownloadForOffline, 8000);
});
