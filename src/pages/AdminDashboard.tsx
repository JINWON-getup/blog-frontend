import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout, getAdminInfo } from "../services/api";
import "../css/adminDashboard.css";

interface AdminInfo {
    adminName: string;
    id: string;
    email: string;
    role: string;
}

export default function AdminDashboard() {
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 관리자 정보 가져오기
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                // TODO: 실제 로그인된 관리자 ID를 가져와야 함
                // 현재는 임시로 하드코딩된 ID 사용
                const tempAdminId = "admin"; // 나중에 로그인 상태에서 가져올 예정
                const info = await getAdminInfo(tempAdminId);
                setAdminInfo(info);
            } catch (error) {
                console.error("관리자 정보 조회 실패:", error);
                alert("관리자 정보를 불러올 수 없습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminInfo();
    }, []);

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            await adminLogout();
            alert("로그아웃되었습니다.");
            navigate("/"); // 메인화면(홈)으로 이동
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃에 실패했습니다.");
        }
    };

    if (isLoading) {
        return (
            <div className="admin-dashboard-container">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
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
                {adminInfo && (
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
                        <div className="info-item">
                            <span className="label">역할:</span>
                            <span className="value">{adminInfo.role}</span>
                        </div>
                    </div>
                )}
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
                    <div className="menu-item">
                        <h3>설정</h3>
                        <p>사이트 설정, 관리자 설정</p>
                        <button className="menu-button" disabled>
                            준비 중
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
