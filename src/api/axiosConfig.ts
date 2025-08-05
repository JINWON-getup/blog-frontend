// src/api/axiosConfig.ts
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,
});

// 👇 [추가] 요청 인터셉터 추가
instance.interceptors.request.use(
    (config) => {
        // localStorage에서 토큰을 가져옵니다.
        const token = localStorage.getItem("token");
        if (!config.headers) {
            config.headers = {};
        }
        if (token) {
            // 토큰이 있으면 Authorization 헤더에 추가합니다.
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default instance;
