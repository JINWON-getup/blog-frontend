import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";
import { useUser } from "../contexts/UserContext";
import "../css/myPage.css";

const MyPage: React.FC = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {
        userInfo,
        logout,
        isLoading,
        updateUserPassword,
        withdrawUserAccount,
    } = useUser();

    // 상태 관리
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    // 회원탈퇴 관련 상태
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawPassword, setWithdrawPassword] = useState("");
    const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);

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

    // 비밀번호 변경 처리
    const handlePasswordUpdate = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            return;
        }

        if (newPassword.length < 6) {
            alert("비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }

        setIsLoadingUpdate(true);
        try {
            await updateUserPassword(currentPassword, newPassword);
            alert("비밀번호가 성공적으로 변경되었습니다.");
            setIsEditingPassword(false);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "비밀번호 변경에 실패했습니다.",
            );
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    // 비밀번호 편집 취소
    const cancelPasswordEdit = () => {
        setIsEditingPassword(false);
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    // 회원탈퇴 처리
    const handleWithdraw = async () => {
        if (!withdrawPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (
            !confirm(
                "정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
            )
        ) {
            return;
        }

        setIsLoadingWithdraw(true);
        try {
            await withdrawUserAccount(withdrawPassword);
            alert("회원탈퇴가 완료되었습니다.");
            navigate("/");
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "회원탈퇴에 실패했습니다.",
            );
        } finally {
            setIsLoadingWithdraw(false);
            setShowWithdrawModal(false);
            setWithdrawPassword("");
        }
    };

    // 회원탈퇴 모달 닫기
    const closeWithdrawModal = () => {
        setShowWithdrawModal(false);
        setWithdrawPassword("");
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
                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </button>
                        </div>
                        <div className="info-item">
                            <label>닉네임:</label>
                            <span>{userInfo.nickName}</span>
                        </div>
                    </div>
                </div>

                <div className="actions-section">
                    <h2>계정 관리</h2>
                    <div className="action-buttons">
                        {!isEditingPassword ? (
                            <button
                                className="edit-profile-btn"
                                onClick={() => setIsEditingPassword(true)}
                            >
                                비밀번호 변경
                            </button>
                        ) : (
                            <div className="password-edit-section">
                                <h3>비밀번호 변경</h3>
                                <div className="password-form">
                                    <div className="form-group">
                                        <label>현재 비밀번호:</label>
                                        <input
                                            type="password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    currentPassword:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="현재 비밀번호 입력"
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>새 비밀번호:</label>
                                        <input
                                            type="password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    newPassword: e.target.value,
                                                }))
                                            }
                                            placeholder="새 비밀번호 입력 (6자 이상)"
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>새 비밀번호 확인:</label>
                                        <input
                                            type="password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordForm((prev) => ({
                                                    ...prev,
                                                    confirmPassword:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="새 비밀번호 재입력"
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="edit-buttons">
                                        <button
                                            onClick={handlePasswordUpdate}
                                            disabled={isLoadingUpdate}
                                            className="save-btn"
                                        >
                                            {isLoadingUpdate
                                                ? "변경 중..."
                                                : "비밀번호 변경"}
                                        </button>
                                        <button
                                            onClick={cancelPasswordEdit}
                                            className="cancel-btn"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            className="withdraw-btn"
                            onClick={() => setShowWithdrawModal(true)}
                        >
                            회원탈퇴
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

                {/* 회원탈퇴 모달 */}
                {showWithdrawModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>회원탈퇴</h3>
                            <p>정말로 회원탈퇴를 하시겠습니까?</p>
                            <p className="warning-text">
                                ⚠️ 이 작업은 되돌릴 수 없으며, 모든 데이터가
                                삭제됩니다.
                            </p>
                            <div className="form-group">
                                <label>비밀번호 확인:</label>
                                <input
                                    type="password"
                                    value={withdrawPassword}
                                    onChange={(e) =>
                                        setWithdrawPassword(e.target.value)
                                    }
                                    placeholder="비밀번호를 입력하세요"
                                    className="edit-input"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button
                                    onClick={handleWithdraw}
                                    disabled={isLoadingWithdraw}
                                    className="withdraw-confirm-btn"
                                >
                                    {isLoadingWithdraw
                                        ? "처리 중..."
                                        : "회원탈퇴"}
                                </button>
                                <button
                                    onClick={closeWithdrawModal}
                                    className="cancel-btn"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPage;
