import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/adminLogin.css";

interface LoginResponse {
    token: string;
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post<LoginResponse>("/api/login", {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/admin");
        } catch (err) {
            console.error("로그인 실패", err);
            alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-title">관리자 로그인</h2>

                <input
                    type="text"
                    placeholder="아이디"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input"
                />

                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />

                <button type="submit" className="login-button">
                    로그인
                </button>
            </form>
        </div>
    );
}
