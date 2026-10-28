// Firebase Project: apptimatic-f509c
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { savePushToken } from './deviceRegistration';

export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBfKF39sjZkrMExahRp8eMY86dKwsmGRC8",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "apptimatic-f509c.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "apptimatic-f509c",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "apptimatic-f509c.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1021648500578",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1021648500578:android:ac8cecc83012c449a05e3b",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5KSZPSQZ6S"
};

// Initialize Firebase App instance
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let messagingInstance = null;

export const getFirebaseMessaging = async () => {
    if (typeof window === 'undefined') return null;

    try {
        const supported = await isSupported();
        if (!supported) {
            console.warn('[Firebase] Messaging is not supported in this browser.');
            return null;
        }

        if (!messagingInstance) {
            messagingInstance = getMessaging(app);
        }
        return messagingInstance;
    } catch (err) {
        console.warn('[Firebase] Could not initialize messaging:', err);
        return null;
    }
};

/**
 * Request notification permission and retrieve FCM device token
 */
export const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return {
            success: false,
            error: 'এই ব্রাউজারে নোটিফিকেশন সুবিধা সমর্থিত নয়।'
        };
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return {
                success: false,
                permission,
                error: 'নোটিফিকেশনের অনুমতি প্রদান করা হয়নি।'
            };
        }

        // Register service worker if available
        let swRegistration = null;
        if ('serviceWorker' in navigator) {
            try {
                swRegistration = await navigator.serviceWorker.register('/sw.js');
                await navigator.serviceWorker.ready;
            } catch (swErr) {
                console.warn('[Firebase] Service Worker registration note:', swErr);
            }
        }

        const messaging = await getFirebaseMessaging();
        let token = null;

        if (messaging) {
            try {
                token = await getToken(messaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
                    serviceWorkerRegistration: swRegistration || undefined
                });

                // The caller syncs it to the backend together with the notification preferences
                if (token) {
                    savePushToken(token);
                }
            } catch (tokenErr) {
                console.warn('[Firebase] FCM token retrieval note:', tokenErr);
            }
        }

        return {
            success: true,
            permission: 'granted',
            token
        };
    } catch (err) {
        console.error('[Firebase] Permission error:', err);
        return {
            success: false,
            error: err.message || 'অনুমতি গ্রহণে ত্রুটি হয়েছে।'
        };
    }
};

/**
 * Listen for foreground push messages
 */
export const setupForegroundNotifications = async (onMessageCallback) => {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return () => {};

    try {
        return onMessage(messaging, (payload) => {
            console.log('[Firebase] Foreground message received:', payload);
            if (onMessageCallback) {
                onMessageCallback(payload);
            }
        });
    } catch (err) {
        console.warn('[Firebase] Foreground listener error:', err);
        return () => {};
    }
};
