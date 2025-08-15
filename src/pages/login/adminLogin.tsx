import { useState } from "react";
import axios from "axios";
import "../../css/adminLogin.css";

// 백엔드 응답 구조에 맞는 인터페이스
interface AdminLoginResponse {
    success: boolean;
    message: string;
}

export default function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post<AdminLoginResponse>(
                "http://localhost:8080/api/admin/login",
                {
                    id,
                    password,
                },
            );

            if (response.data.success) {
                // 로그인 성공
                alert("로그인 성공!");
                // TODO: 로그인 성공 후 이동할 페이지 설정
                // navigate("/admin-dashboard"); // 예시
                console.log("로그인 성공:", response.data.message);
            } else {
                // 로그인 실패
                alert(`로그인 실패: ${response.data.message}`);
            }
        } catch (err) {
            console.error("로그인 실패", err);

            // 에러 응답에서 메시지 추출
            const axiosError = err as {
                response?: { data?: { message?: string } };
            };
            if (axiosError.response?.data?.message) {
                alert(`로그인 실패: ${axiosError.response.data.message}`);
            } else {
                alert("로그인 실패: 서버 연결에 문제가 있습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2 className="login-title">관리자 로그인</h2>

                    <input
                        type="text"
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        className="login-input"
                        disabled={isLoading}
                    />

                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}
