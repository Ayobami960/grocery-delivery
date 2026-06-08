import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1"
})


// Inject JWT token localStorage into every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token")
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";
        const isDeliveryRequest = requestUrl.includes("/delivery");
        const status = error.response?.status;

        if (status === 401 || (status === 403 && isDeliveryRequest)) {
            localStorage.removeItem(isDeliveryRequest ? "delivery_token" : "auth_token");
            localStorage.removeItem(isDeliveryRequest ? "delivery_partner" : "auth_user");

            const loginPath = isDeliveryRequest ? "/delivery/login" : "/login";
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes("/login") &&
                !window.location.pathname.includes("/register")) {
                window.location.pathname = loginPath
            }
        }
        return Promise.reject(error)
    }
)

export default api;
