import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    adminLogout,
    getPosts,
    deletePost,
    getUsers,
    deleteUser,
} from "../services/api";
import { useAdmin } from "../contexts/AdminContext";
import { useTheme } from "../components/ThemeContext";
import type { Post, User } from "../services/api";
import "../css/adminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminInfo, isLoading, logout: contextLogout } = useAdmin();
    const { isDark } = useTheme();

    // 게시글 관리 상태
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [isPostManagementMode, setIsPostManagementMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // 사용자 관리 상태
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isUserManagementMode, setIsUserManagementMode] = useState(false);
    const [userLoading, setUserLoading] = useState(false);

    // 검색과 페이지네이션 상태
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(20);

    // 사용자 검색과 페이지네이션 상태
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [userCurrentPage, setUserCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);

    // 로그인 상태 확인
    useEffect(() => {
        // 로딩이 완료되고 관리자 정보가 없는 경우에만 리다이렉트
        if (!isLoading && !adminInfo) {
            navigate("/adminLogin");
        }
    }, [adminInfo, isLoading, navigate]);

    // 게시글 목록 가져오기
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
            setFilteredPosts(fetchedPosts);
        } catch (error) {
            console.error("게시글 목록을 가져오는 중 오류:", error);
            alert("게시글 목록을 가져오는데 실패했습니다.");
            setPosts([]);
            setFilteredPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // 날짜 안전 포맷터
    const formatDateSafely = (value?: string | number | Date) => {
        if (!value) return "";
        const date = new Date(value);
        return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ko-KR");
    };

    // 검색 필터링
    const handleSearch = (searchValue: string) => {
        setSearchTerm(searchValue);
        setCurrentPage(1); // 검색 시 첫 페이지로 이동

        if (!searchValue.trim()) {
            setFilteredPosts(posts || []);
            return;
        }

        const filtered = (posts || []).filter(
            (post) =>
                post.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                post.content
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                post.nickName
                    .toLowerCase()
                    .includes(searchValue.toLowerCase()) ||
                post.category.toLowerCase().includes(searchValue.toLowerCase()),
        );
        setFilteredPosts(filtered);
    };

    // 페이지네이션 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = (filteredPosts || []).slice(
        indexOfFirstPost,
        indexOfLastPost,
    );
    const totalPages = Math.ceil((filteredPosts || []).length / postsPerPage);

    // 페이지 변경
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 게시글 삭제
    const handleDeletePost = async (postId: number) => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deletePost(postId);
            const updatedPosts = posts.filter((post) => post.id !== postId);
            setPosts(updatedPosts);
            setFilteredPosts(updatedPosts);
            alert("게시글이 삭제되었습니다.");
        } catch (error) {
            console.error("게시글 삭제 중 오류:", error);
            alert("게시글 삭제에 실패했습니다.");
        }
    };

    // 사용자 목록 가져오기
    const fetchUsers = async () => {
        try {
            setUserLoading(true);
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
            setFilteredUsers(fetchedUsers);
        } catch (error) {
            console.error("사용자 목록을 가져오는 중 오류:", error);
            alert("사용자 목록을 가져오는데 실패했습니다.");
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setUserLoading(false);
        }
    };

    // 사용자 검색 필터링
    const handleUserSearch = (searchValue: string) => {
        setUserSearchTerm(searchValue);
        setUserCurrentPage(1); // 검색 시 첫 페이지로 이동

        if (!searchValue.trim()) {
            setFilteredUsers(users || []);
            return;
        }

        const safeQuery = searchValue.toLowerCase();
        const filtered = (users || []).filter((user) => {
            const uid = (user.userId || "").toLowerCase();
            const nick = (user.nickName || "").toLowerCase();
            const mail = (user.email || "").toLowerCase();
            const phone = user.phoneNumber || "";
            return (
                uid.includes(safeQuery) ||
                nick.includes(safeQuery) ||
                mail.includes(safeQuery) ||
                phone.includes(searchValue)
            );
        });
        setFilteredUsers(filtered);
    };

    // 사용자 페이지네이션 계산
    const indexOfLastUser = userCurrentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = (filteredUsers || []).slice(
        indexOfFirstUser,
        indexOfLastUser,
    );
    const totalUserPages = Math.ceil(
        (filteredUsers || []).length / usersPerPage,
    );

    // 사용자 페이지 변경
    const handleUserPageChange = (pageNumber: number) => {
        setUserCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 사용자 삭제
    const handleDeleteUser = async (pid: number) => {
        if (!window.confirm("정말로 이 사용자를 삭제하시겠습니까?")) {
            return;
        }

        try {
            await deleteUser(pid);
            const updatedUsers = users.filter((user) => user.pid !== pid);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            alert("사용자가 삭제되었습니다.");
        } catch (error) {
            console.error("사용자 삭제 중 오류:", error);
            alert("사용자 삭제에 실패했습니다.");
        }
    };

    // 게시글 관리 모드 토글
    const togglePostManagementMode = () => {
        if (!isPostManagementMode) {
            fetchPosts();
        }
        setIsPostManagementMode(!isPostManagementMode);
    };

    // 사용자 관리 모드 토글
    const toggleUserManagementMode = () => {
        if (!isUserManagementMode) {
            fetchUsers();
        }
        setIsUserManagementMode(!isUserManagementMode);
    };

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

            {/* 메뉴 영역 */}
            <section className="menu-section">
                <div className="menu-grid">
                    <div className="menu-item">
                        <h3>게시글 관리</h3>
                        <p>게시글 작성, 수정, 삭제</p>
                        <button
                            className="menu-button"
                            onClick={togglePostManagementMode}
                        >
                            {isPostManagementMode
                                ? "관리 모드 종료"
                                : "게시글 관리 시작"}
                        </button>
                    </div>
                    <div className="menu-item">
                        <h3>사용자 관리</h3>
                        <p>사용자 계정 관리</p>
                        <button
                            className="menu-button"
                            onClick={toggleUserManagementMode}
                        >
                            {isUserManagementMode
                                ? "관리 모드 종료"
                                : "사용자 관리 시작"}
                        </button>
                    </div>
                </div>
            </section>

            {/* 게시글 관리 모드 */}
            {isPostManagementMode && (
                <section className="post-management-section">
                    <h2>게시글 관리</h2>

                    {/* 검색 및 통계 */}
                    <div className="post-management-header">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="제목, 내용, 작성자, 카테고리로 검색..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="post-stats">
                            총 {(filteredPosts || []).length}개 게시글
                            {searchTerm &&
                                ` (검색 결과: ${
                                    (filteredPosts || []).length
                                }개)`}
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">게시글을 불러오는 중...</div>
                    ) : (
                        <>
                            {/* 게시글 테이블 */}
                            <div className="post-table-container">
                                <table className="post-table">
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>제목</th>
                                            <th>작성자</th>
                                            <th>카테고리</th>
                                            <th>작성일</th>
                                            <th>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPosts.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="no-posts"
                                                >
                                                    {searchTerm
                                                        ? "검색 결과가 없습니다."
                                                        : "등록된 게시글이 없습니다."}
                                                </td>
                                            </tr>
                                        ) : (
                                            currentPosts.map((post, index) => (
                                                <tr
                                                    key={post.id}
                                                    className="post-row"
                                                >
                                                    <td className="post-number">
                                                        {indexOfFirstPost +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="post-title-cell">
                                                        <div className="post-title-text">
                                                            {post.title}
                                                        </div>
                                                        {post.content.length >
                                                            50 && (
                                                            <div className="post-content-preview-small">
                                                                {post.content.substring(
                                                                    0,
                                                                    50,
                                                                )}
                                                                ...
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="post-author">
                                                        {post.nickName}
                                                    </td>
                                                    <td className="post-category">
                                                        <span className="category-badge">
                                                            {post.category}
                                                        </span>
                                                    </td>
                                                    <td className="post-date">
                                                        {formatDateSafely(
                                                            post.createdAt,
                                                        )}
                                                    </td>
                                                    <td className="post-actions">
                                                        <button
                                                            className="edit-button-small"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/post/${post.id}`,
                                                                )
                                                            }
                                                            title="수정"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="delete-button-small"
                                                            onClick={() =>
                                                                post.id &&
                                                                handleDeletePost(
                                                                    post.id,
                                                                )
                                                            }
                                                            title="삭제"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 페이지네이션 */}
                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="page-button"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        이전
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (page) =>
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <=
                                                    2,
                                        )
                                        .map((page, index, array) => (
                                            <React.Fragment key={page}>
                                                {index > 0 &&
                                                    array[index - 1] !==
                                                        page - 1 && (
                                                        <span className="page-ellipsis">
                                                            ...
                                                        </span>
                                                    )}
                                                <button
                                                    className={`page-button ${
                                                        page === currentPage
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handlePageChange(page)
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        ))}

                                    <button
                                        className="page-button"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {/* 사용자 관리 모드 */}
            {isUserManagementMode && (
                <section className="post-management-section">
                    <h2>사용자 관리</h2>

                    {/* 검색 및 통계 */}
                    <div className="post-management-header">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="아이디, 닉네임, 이메일, 전화번호로 검색..."
                                value={userSearchTerm}
                                onChange={(e) =>
                                    handleUserSearch(e.target.value)
                                }
                                className="search-input"
                            />
                        </div>
                        <div className="post-stats">
                            총 {(filteredUsers || []).length}명 사용자
                            {userSearchTerm &&
                                ` (검색 결과: ${
                                    (filteredUsers || []).length
                                }명)`}
                        </div>
                    </div>

                    {userLoading ? (
                        <div className="loading">사용자를 불러오는 중...</div>
                    ) : (
                        <>
                            {/* 사용자 테이블 */}
                            <div className="post-table-container">
                                <table className="post-table">
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>아이디</th>
                                            <th>닉네임</th>
                                            <th>이메일</th>
                                            <th>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="no-posts"
                                                >
                                                    {userSearchTerm
                                                        ? "검색 결과가 없습니다."
                                                        : "등록된 사용자가 없습니다."}
                                                </td>
                                            </tr>
                                        ) : (
                                            currentUsers.map((user, index) => (
                                                <tr
                                                    key={user.pid}
                                                    className="post-row"
                                                >
                                                    <td className="post-number">
                                                        {indexOfFirstUser +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="post-author">
                                                        {user.userId}
                                                    </td>
                                                    <td className="post-title-cell">
                                                        <div className="post-title-text">
                                                            {user.nickName}
                                                        </div>
                                                    </td>
                                                    <td className="post-author">
                                                        {user.email}
                                                    </td>
                                                    <td className="post-actions">
                                                        <button
                                                            className="delete-button-small"
                                                            onClick={() =>
                                                                handleDeleteUser(
                                                                    user.pid,
                                                                )
                                                            }
                                                            title="삭제"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* 페이지네이션 */}
                            {totalUserPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="page-button"
                                        onClick={() =>
                                            handleUserPageChange(
                                                userCurrentPage - 1,
                                            )
                                        }
                                        disabled={userCurrentPage === 1}
                                    >
                                        이전
                                    </button>

                                    {Array.from(
                                        { length: totalUserPages },
                                        (_, i) => i + 1,
                                    )
                                        .filter(
                                            (page) =>
                                                page === 1 ||
                                                page === totalUserPages ||
                                                Math.abs(
                                                    page - userCurrentPage,
                                                ) <= 2,
                                        )
                                        .map((page, index, array) => (
                                            <React.Fragment key={page}>
                                                {index > 0 &&
                                                    array[index - 1] !==
                                                        page - 1 && (
                                                        <span className="page-ellipsis">
                                                            ...
                                                        </span>
                                                    )}
                                                <button
                                                    className={`page-button ${
                                                        page === userCurrentPage
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleUserPageChange(
                                                            page,
                                                        )
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        ))}

                                    <button
                                        className="page-button"
                                        onClick={() =>
                                            handleUserPageChange(
                                                userCurrentPage + 1,
                                            )
                                        }
                                        disabled={
                                            userCurrentPage === totalUserPages
                                        }
                                    >
                                        다음
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}
        </div>
    );
}
