import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useUser } from "../contexts/UserContext";
import "../css/myPage.css";

const MyPage: React.FC = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { userInfo, logout, isLoading } = useUser();

    // 로그인되지 않은 사용자는 홈으로 리다이렉트
    useEffect(() => {
        if (!isLoading && !userInfo) {
            navigate("/");
        }
    }, [userInfo, isLoading, navigate]);

    // 로딩 중이거나 사용자 정보가 없는 경우
    if (isLoading || !userInfo) {
        return (
            <div className={`mypage-container ${isDark ? "dark" : ""}`}>
                <div className="mypage-wrapper">
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        {isLoading
                            ? "로딩 중..."
                            : "사용자 정보를 불러오는 중..."}
                    </div>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        alert("로그아웃되었습니다.");
        navigate("/");
    };

    return (
        <div className={`mypage-container ${isDark ? "dark" : ""}`}>
            <div className="mypage-wrapper">
                <h1>마이페이지</h1>

                <div className="user-info-section">
                    <h2>사용자 정보</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>아이디:</label>
                            <span>{userInfo.userId}</span>
                        </div>
                        <div className="info-item">
                            <label>닉네임:</label>
                            <span>{userInfo.nickName}</span>
                        </div>
                        <div className="info-item">
                            <label>이메일:</label>
                            <span>{userInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <label>회원번호:</label>
                            <span>{userInfo.pid}</span>
                        </div>
                    </div>
                </div>

                <div className="actions-section">
                    <h2>계정 관리</h2>
                    <div className="action-buttons">
                        <button
                            className="edit-profile-btn"
                            onClick={() =>
                                alert("프로필 수정 기능은 준비 중입니다.")
                            }
                        >
                            프로필 수정
                        </button>
                        <button
                            className="change-password-btn"
                            onClick={() =>
                                alert("비밀번호 변경 기능은 준비 중입니다.")
                            }
                        >
                            비밀번호 변경
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                </div>

                <div className="back-section">
                    <button
                        className="back-home-btn"
                        onClick={() => navigate("/")}
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
