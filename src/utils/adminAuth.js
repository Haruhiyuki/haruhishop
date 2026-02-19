const ADMIN_TOKEN_KEY = 'sos_admin_token';

const decodePayload = (token) => {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json);
    } catch {
        return null;
    }
};

export const getAdminToken = () => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
};

export const setAdminToken = (token) => {
    if (typeof window === 'undefined') return;
    if (!token) return;
    window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const hasValidAdminToken = () => {
    const token = getAdminToken();
    if (!token) return false;

    const payload = decodePayload(token);
    if (!payload) {
        clearAdminToken();
        return false;
    }

    if (payload.exp && Number(payload.exp) <= Math.floor(Date.now() / 1000)) {
        clearAdminToken();
        return false;
    }

    return true;
};

export const buildAdminAuthHeaders = (headers = {}) => {
    if (!hasValidAdminToken()) return { ...headers };
    return {
        ...headers,
        Authorization: `Bearer ${getAdminToken()}`
    };
};
