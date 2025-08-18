import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../services/api";
import { useAdmin } from "../contexts/AdminContext";
import { useTheme } from "../components/ThemeContext";
import "../css/adminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminInfo, isLoading, logout: contextLogout } = useAdmin();
    const { isDark } = useTheme();

    // 로그인 상태 확인
    useEffect(() => {
        console.log("AdminDashboard: adminInfo 변경됨:", adminInfo);

        // 로딩이 완료되고 관리자 정보가 없는 경우에만 리다이렉트
        if (!isLoading && !adminInfo) {
            console.log(
                "AdminDashboard: 로그인되지 않음, 로그인 페이지로 이동",
            );
            navigate("/adminLogin");
        }
    }, [adminInfo, isLoading, navigate]);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            // 백엔드 로그아웃 API 호출
            await adminLogout();
            // Context에서 로그아웃 처리
            contextLogout();
            alert("로그아웃되었습니다.");
            navigate("/"); // 메인화면(홈)으로 이동
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃에 실패했습니다.");
        }
    };

    if (isLoading) {
        return (
            <div
                className={`admin-dashboard-container ${
                    isDark ? "dark-mode" : ""
                }`}
            >
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    if (!adminInfo) {
        return null; // 리다이렉트 중일 때 아무것도 렌더링하지 않음
    }

    return (
        <div
            className={`admin-dashboard-container ${isDark ? "dark-mode" : ""}`}
        >
            {/* 헤더 영역 */}
            <header className="dashboard-header">
                <h1>관리자 대시보드</h1>
                <button onClick={handleLogout} className="logout-button">
                    로그아웃
                </button>
            </header>

            {/* 관리자 정보 영역 */}
            <section className="admin-info-section">
                <h2>관리자 정보</h2>
                <div className="admin-info-card">
                    <div className="info-item">
                        <span className="label">이름:</span>
                        <span className="value">{adminInfo.adminName}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">아이디:</span>
                        <span className="value">{adminInfo.id}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">이메일:</span>
                        <span className="value">{adminInfo.email}</span>
                    </div>
                </div>
            </section>

            {/* 메뉴 영역 */}
            <section className="menu-section">
                <h2>관리 메뉴</h2>
                <div className="menu-grid">
                    <div className="menu-item">
                        <h3>게시글 관리</h3>
                        <p>게시글 작성, 수정, 삭제</p>
                        <button className="menu-button" disabled>
                            준비 중
                        </button>
                    </div>
                    <div className="menu-item">
                        <h3>사용자 관리</h3>
                        <p>사용자 계정 관리</p>
                        <button className="menu-button" disabled>
                            준비 중
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
