
import { apiRequest } from "./api";

const AUTH_URL = "/api/v1/auth";
const TOKEN_KEY = "access_token";

export const userService = {
    async register({
        username,
        first_name,
        last_name,
        email,
        password,
    }) {
        return apiRequest("/api/v1/users/", {
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

        return data;
    },

    async getCurrentUser() {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
            return null;
        }

        return apiRequest(`${AUTH_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
    },
};

export default userService;