import { apiRequest } from "./api";

export const deviceService = {
    getAll() {
        return apiRequest("/api/v1/devices/");
    },

    getById(id) {
        return apiRequest(`/api/v1/devices/${id}`);
    },

    create(data) {
        return apiRequest("/api/v1/devices/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    delete(id) {
        return apiRequest(`/api/v1/devices/${id}`, {
            method: "DELETE",
        });
    },
};