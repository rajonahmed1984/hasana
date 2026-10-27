// API Helper for Admin Portal

export function getCsrfToken() {
    return window.AdminConfig?.csrfToken || 
           document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || 
           '';
}

export async function apiRequest(url, options = {}) {
    const defaultHeaders = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': getCsrfToken(),
    };

    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        credentials: 'include',
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
    };

    const res = await fetch(url, config);
    
    // If redirected to login, reload to let Laravel redirect properly
    if (res.status === 401 || res.status === 419) {
        window.location.href = '/admin/login';
        throw new Error('অনুগ্রহ করে আবার লগইন করুন');
    }

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) {
        const errorMsg = data?.message || data?.error || (data?.errors ? Object.values(data.errors).flat().join(', ') : 'অনুরোধ ব্যর্থ হয়েছে');
        const error = new Error(errorMsg);
        error.status = res.status;
        error.errors = data?.errors;
        throw error;
    }

    return data;
}

export function apiGet(url, params = {}) {
    const urlObj = new URL(url, window.location.origin);
    Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
            urlObj.searchParams.set(key, val);
        }
    });
    return apiRequest(urlObj.toString(), { method: 'GET' });
}

export function apiPost(url, body = {}) {
    const isFormData = body instanceof FormData;
    return apiRequest(url, {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body),
    });
}

export function apiPut(url, body = {}) {
    const isFormData = body instanceof FormData;
    if (isFormData) {
        body.append('_method', 'PUT');
        return apiRequest(url, {
            method: 'POST',
            body,
        });
    }
    return apiRequest(url, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

export function apiDelete(url) {
    return apiRequest(url, {
        method: 'DELETE',
    });
}
