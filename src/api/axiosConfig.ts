import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 5000,
    // 👇 [수정] 이 설정을 추가해야 브라우저가 다른 도메인으로 쿠키를 보냅니다.
    withCredentials: true,
});

export default instance;
