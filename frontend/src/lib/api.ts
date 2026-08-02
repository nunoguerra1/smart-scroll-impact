import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        let token =
            Cookies.get("smart_scroll_token") ||
            Cookies.get("access_token") ||
            Cookies.get("token");

        if (!token && typeof window !== "undefined") {
            token =
                localStorage.getItem("smart_scroll_token") ||
                localStorage.getItem("token") ||
                localStorage.getItem("access_token") ||
                undefined;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("⚠️ [Axios] Nenhum token encontrado nos cookies/localStorage!");
        }

        return config;
    },
    (error) => Promise.reject(error)
);