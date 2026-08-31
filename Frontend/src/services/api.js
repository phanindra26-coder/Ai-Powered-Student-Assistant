const API_BASE_URL = "";

const getAuthToken = () => localStorage.getItem("token");

const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    let payload = null;

    if (contentType.includes("application/json")) {
        payload = await response.json();
    } else {
        payload = await response.text();
    }

    if (!response.ok) {
        const message =
            typeof payload === "string"
                ? payload
                : payload?.message || "Request failed";

        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
};

const request = async (endpoint, options = {}) => {
    const token = getAuthToken();

    const config = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        return await handleResponse(response);
    } catch (error) {
        if (error.name === "TypeError") {
            throw new Error(
                "Unable to connect to server. Please make sure the backend is running."
            );
        }

        throw error;
    }
};

export const api = {
    get: (endpoint) => request(endpoint, { method: "GET" }),
    post: (endpoint, data) =>
        request(endpoint, {
            method: "POST",
            body: JSON.stringify(data || {}),
        }),
    put: (endpoint, data) =>
        request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data || {}),
        }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};

export default api;
