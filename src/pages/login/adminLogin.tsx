import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../contexts/AdminContext";
import { adminLogin } from "../../services/api";
import "../../css/adminLogin.css";

export default function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, adminInfo, isLoading: contextLoading } = useAdmin();

    // 이미 로그인된 상태라면 대시보드로 리다이렉트
    useEffect(() => {
        if (!contextLoading && adminInfo) {
            navigate("/admin-dashboard");
        }
    }, [adminInfo, contextLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await adminLogin({ id, password });

            if (response.success) {
                // Context에 관리자 정보 저장
                login({
                    adminName: response.admin.adminName,
                    id: response.admin.id,
                    email: response.admin.email,
                });

                alert("로그인 성공!");
                navigate("/admin-dashboard");
            } else {
                alert(`로그인 실패: ${response.message}`);
            }
        } catch (err) {
            console.error("로그인 실패", err);

            if (err instanceof Error) {
                alert(`로그인 실패: ${err.message}`);
            } else {
                alert("로그인 실패: 서버 연결에 문제가 있습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 로딩 중이거나 이미 로그인된 상태라면 로딩 화면 표시
    if (contextLoading || adminInfo) {
        return (
            <div className="admin-login-container">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

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
