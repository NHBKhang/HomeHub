
import { apiRequest } from "./api";

const AUTH_URL = "/api/v1/auth";
const USERS_URL = "/api/v1/users";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const userService = {
    async register({
        username,
        first_name,
        last_name,
        email,
        password,
    }) {
        return apiRequest(`${USERS_URL}/`, {
            method: "POST",
            body: JSON.stringify({
                username: username.trim(),
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.trim(),
                password,
            }),
        });
    },

    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        const data = await apiRequest(`${AUTH_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (data.access_token) {
            localStorage.setItem(TOKEN_KEY, data.access_token);
        }

        if (data.refresh_token) {
            localStorage.setItem(
                REFRESH_TOKEN_KEY,
                data.refresh_token
            );
        }

        return data;
    },

    async refreshToken() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
            this.logout();
            return null;
        }

        try {
            const data = await apiRequest(`${AUTH_URL}/refresh`, {
                method: "POST",
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
            });

            if (data.access_token) {
                localStorage.setItem(TOKEN_KEY, data.access_token);
            }

            if (data.refresh_token) {
                localStorage.setItem(
                    REFRESH_TOKEN_KEY,
                    data.refresh_token
                );
            }

            return data.access_token ?? null;
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    async getCurrentUser() {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            return null;
        }

        return apiRequest(`${USERS_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    async updateProfile(profileData) {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            return null;
        }

        return apiRequest(`${USERS_URL}/me`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
        });
    },

    async logout() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        try {
            if (refreshToken) {
                await apiRequest(`${AUTH_URL}/logout`, {
                    method: "POST",
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                });
            }
        } finally {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
    },
};

export default userService;