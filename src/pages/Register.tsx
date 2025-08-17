import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useTheme } from "../components/ThemeContext";
import "../css/signUp.css";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        userId: "",
        nickName: "",
        password: "",
        confirmPassword: "",
        email: "",
        phoneNumber: "",
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
        } else if (formData.userId.length < 4) {
            newErrors.userId = "아이디는 4자 이상이어야 합니다.";
        }

        // nickName 검증
        if (!formData.nickName.trim()) {
            newErrors.nickName = "닉네임을 입력해주세요.";
        } else if (formData.nickName.length < 2) {
            newErrors.nickName = "닉네임은 2자 이상이어야 합니다.";
        }

        // password 검증
        if (!formData.password) {
            newErrors.password = "비밀번호를 입력해주세요.";
        } else if (formData.password.length < 6) {
            newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
        }

        // confirmPassword 검증
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
        }

        // email 검증
        if (!formData.email) {
            newErrors.email = "이메일을 입력해주세요.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식을 입력해주세요.";
        }

        // phoneNumber 검증
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "전화번호를 입력해주세요.";
        } else if (!/^[0-9-]+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "올바른 전화번호 형식을 입력해주세요.";
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
            // 회원가입 API 호출
            const result = await register({
                userId: formData.userId,
                nickName: formData.nickName,
                password: formData.password,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
            });

            if (result.success) {
                alert("회원가입이 완료되었습니다!");
                navigate("/"); // 홈 페이지로 이동
            } else {
                alert(result.message || "회원가입에 실패했습니다.");
            }
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "회원가입에 실패했습니다. 다시 시도해주세요.",
            );
        }
    };

    return (
        <div className={`signup-container ${isDark ? "dark" : ""}`}>
            <div className="signup-form-wrapper">
                <h1>회원가입</h1>
                <p className="signup-subtitle">
                    블로그에 가입하고 다양한 콘텐츠를 만나보세요!
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
                            placeholder="4자 이상의 아이디를 입력하세요"
                            className={errors.userId ? "error" : ""}
                        />
                        {errors.userId && (
                            <span className="error-message">
                                {errors.userId}
                            </span>
                        )}
                    </div>

                    {/* 닉네임 */}
                    <div className="form-group">
                        <label htmlFor="nickName">
                            닉네임 <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="nickName"
                            name="nickName"
                            value={formData.nickName}
                            onChange={handleInputChange}
                            placeholder="2자 이상의 닉네임을 입력하세요"
                            className={errors.nickName ? "error" : ""}
                        />
                        {errors.nickName && (
                            <span className="error-message">
                                {errors.nickName}
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
                            placeholder="6자 이상의 비밀번호를 입력하세요"
                            className={errors.password ? "error" : ""}
                        />
                        {errors.password && (
                            <span className="error-message">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            비밀번호 확인 <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            className={errors.confirmPassword ? "error" : ""}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div className="form-group">
                        <label htmlFor="email">
                            이메일 <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                            className={errors.email ? "error" : ""}
                        />
                        {errors.email && (
                            <span className="error-message">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* 전화번호 */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber">
                            전화번호 <span className="required">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="010-1234-5678"
                            className={errors.phoneNumber ? "error" : ""}
                        />
                        {errors.phoneNumber && (
                            <span className="error-message">
                                {errors.phoneNumber}
                            </span>
                        )}
                    </div>

                    {/* 회원가입 버튼 */}
                    <button type="submit" className="signup-button">
                        회원가입
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div className="login-link">
                    이미 계정이 있으신가요?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="link-button"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
