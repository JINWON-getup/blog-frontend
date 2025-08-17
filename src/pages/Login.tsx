import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { useTheme } from "../components/ThemeContext";
import { useUser } from "../contexts/UserContext";
import "../css/signUp.css";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { login: userLogin } = useUser();
    const [formData, setFormData] = useState({
        userId: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // 입력 시 해당 필드의 에러 메시지 제거
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // userId 검증
        if (!formData.userId.trim()) {
            newErrors.userId = "아이디를 입력해주세요.";
        }

        // password 검증
        if (!formData.password) {
            newErrors.password = "비밀번호를 입력해주세요.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            console.log("로그인 폼 데이터:", formData);

            // 로그인 API 호출
            const result = await login({
                userId: formData.userId,
                password: formData.password,
            });

            if (result.success) {
                alert("로그인이 완료되었습니다!");
                if (result.user) {
                    console.log("로그인 성공, 사용자 정보:", result.user);

                    // 서버 응답에서 필요한 필드만 추출
                    const userInfo = {
                        userId: result.user.userId,
                        nickName: result.user.userId, // nickName이 없으므로 userId 사용
                        email: result.user.email,
                        pid: result.user.pid,
                    };

                    userLogin(userInfo); // UserContext에 사용자 정보 저장
                    console.log("UserContext 업데이트 완료");
                } else {
                    console.log(
                        "로그인 성공했지만 user 데이터가 없음:",
                        result,
                    );
                }
                navigate("/"); // 홈 페이지로 이동
            } else {
                console.log("로그인 실패, 응답:", result);
                alert(result.message || "로그인이 실패했습니다.");
            }
        } catch (error) {
            console.error("로그인 실패:", error);

            let errorMessage = "로그인에 실패했습니다. 다시 시도해주세요.";

            if (error instanceof Error) {
                errorMessage = error.message;

                // 특정 에러 메시지에 대한 사용자 친화적인 안내
                if (error.message.includes("서버에 연결할 수 없습니다")) {
                    errorMessage =
                        "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
                } else if (error.message.includes("400")) {
                    errorMessage = "아이디와 비밀번호를 확인해주세요.";
                }
            }

            alert(errorMessage);
        }
    };

    return (
        <div className={`signup-container ${isDark ? "dark" : ""}`}>
            <div className="signup-form-wrapper">
                <h1>로그인</h1>
                <p className="signup-subtitle">
                    블로그에 로그인하고 다양한 콘텐츠를 만나보세요!
                </p>

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* 아이디 */}
                    <div className="form-group">
                        <label htmlFor="userId">
                            아이디 <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleInputChange}
                            placeholder="아이디를 입력하세요"
                            className={errors.userId ? "error" : ""}
                        />
                        {errors.userId && (
                            <span className="error-message">
                                {errors.userId}
                            </span>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div className="form-group">
                        <label htmlFor="password">
                            비밀번호 <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 입력하세요"
                            className={errors.password ? "error" : ""}
                        />
                        {errors.password && (
                            <span className="error-message">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* 로그인 버튼 */}
                    <button type="submit" className="signup-button">
                        로그인
                    </button>
                </form>

                {/* 회원가입 링크 */}
                <div className="login-link">
                    계정이 없으신가요?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="link-button"
                    >
                        회원가입하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
