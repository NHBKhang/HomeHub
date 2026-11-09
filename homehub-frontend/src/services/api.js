
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "access_token";

async function request(path, options = {}, auth = false) {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
        ...options.headers,
    };

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {
        headers["Content-Type"] = "application/json";
    }

    if (auth && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
            errorData?.detail || `API error: ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


export function apiRequest(path, options = {}) {
    return request(path, options, false);
}


export function apiRequestAuth(path, options = {}) {
    return request(path, options, true);
}