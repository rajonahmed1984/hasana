// Keeps the backend's device_tokens row (push token + location + notification preferences) in sync.

import { Capacitor } from '@capacitor/core';

const WEB_TOKEN_KEY = 'hasana-fcm-token';
const NATIVE_TOKEN_KEY = 'hasana-native-push-token';

export const getDevicePlatform = () => {
    const platform = Capacitor.getPlatform();
    return platform === 'android' || platform === 'ios' ? platform : 'web';
};

export const getPushToken = () => {
    try {
        return localStorage.getItem(getDevicePlatform() === 'web' ? WEB_TOKEN_KEY : NATIVE_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const savePushToken = (token) => {
    try {
        localStorage.setItem(getDevicePlatform() === 'web' ? WEB_TOKEN_KEY : NATIVE_TOKEN_KEY, token);
    } catch {
        // ignore
    }
};

/**
 * POST the current token with any extra fields (location, preferences).
 * The backend only overwrites the fields that are sent.
 */
export const syncDeviceWithBackend = async (fields = {}) => {
    const token = getPushToken();
    if (!token) return false;

    try {
        const response = await fetch('/api/notifications/register-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                token,
                platform: getDevicePlatform(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka',
                ...fields,
            }),
        });
        const data = await response.json();
        return Boolean(data.success);
    } catch (err) {
        console.warn('[DeviceRegistration] Sync failed:', err);
        return false;
    }
};
