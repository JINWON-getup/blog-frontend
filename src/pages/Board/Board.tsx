import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Post } from "../../services/api";
import { API_BASE_URL } from "../../services/api";
import { useAdmin } from "../../contexts/AdminContext";
import { useUser } from "../../contexts/UserContext";
import "../../css/board.css";

// Board 컴포넌트가 받을 props의 타입을 정의
interface BoardProps {
    boardType?: string;
}

// props로 boardType을 받습니다.
export default function Board({ boardType }: BoardProps) {
    const navigate = useNavigate();
    const { isLoggedIn } = useAdmin();
    const { isLoggedIn: isUserLoggedIn } = useUser();

    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchTag, setSearchTag] = useState("");
    const [loading, setLoading] = useState(true);

    // 페이지네이션 상태 추가
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(9); // 페이지당 게시글 수 (3x3 그리드)

    // 게시판별 카테고리 매핑 (CreatePost.tsx와 동일)
    const boardCategories = {
        IT: ["전체", "Frontend", "Backend", "Database", "기타"],
        JAPANESE: ["전체", "일본어", "문화", "기타"],
        DAILY: [
            "전체",
            "일상",
            "게임",
            "영화/드라마/애니메이션",
            "음악",
            "기타",
        ],
    };

    // 현재 게시판의 카테고리 가져오기
    const getCurrentBoardCategories = () => {
        if (!boardType) return ["전체", "기타"];

        const boardTypeUpper = boardType.toUpperCase();
        return (
            boardCategories[boardTypeUpper as keyof typeof boardCategories] || [
                "전체",
                "기타",
            ]
        );
    };

    // 게시글 상세보기로 이동하는 함수
    const handlePostClick = useCallback(
        (postId: number) => {
            navigate(`/post/${postId}`);
        },
        [navigate],
    );

    // 카테고리 클릭 함수
    const handleCategoryClick = useCallback((category: string) => {
        setSelectedCategory(category);
    }, []);

    // 글쓰기 버튼 클릭 함수
    const handleWriteClick = useCallback(() => {
        navigate("/write", {
            state: { boardType: boardType },
        });
    }, [navigate, boardType]);

    // API에서 게시글 데이터를 가져오는 함수
    const fetchPosts = async () => {
        try {
            setLoading(true);

            // axios를 사용하여 API 호출
            const params = boardType ? { boardType: boardType } : {};
            const response = await axios.get(`${API_BASE_URL}/api/post`, {
                params,
            });

            // 데이터가 배열인지 확인
            if (Array.isArray(response.data)) {
                // createdAt 기준으로 최신글부터 정렬
                const sortedPosts = response.data.sort((a: Post, b: Post) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });
                setPosts(sortedPosts);
            } else {
                console.error("API 응답이 배열이 아닙니다:", response.data);
                setPosts([]);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시와 boardType 변경 시 API 호출
    useEffect(() => {
        fetchPosts();
        setSelectedCategory("전체");
        setSearchTag("");
    }, [boardType]);

    // tags를 배열로 변환하는 헬퍼 함수
    const getTagsArray = useCallback((tags: string[] | string): string[] => {
        if (Array.isArray(tags)) {
            return tags;
        }
        // string인 경우 쉼표로 분리
        return tags ? tags.split(",").map((tag) => tag.trim()) : [];
    }, []);

    // 날짜 포맷팅 함수
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 필터링 로직
    const filteredData = posts.filter((post) => {
        const categoryMatch =
            selectedCategory === "전체" || post.category === selectedCategory;
        const tagsArray = getTagsArray(post.tags);
        const tagMatch =
            searchTag === "" ||
            tagsArray.some((tag) =>
                tag.toLowerCase().includes(searchTag.toLowerCase()),
            );
        return categoryMatch && tagMatch;
    });

    // 페이지네이션 로직 추가
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredData.length / postsPerPage);

    // 페이지 변경 함수
    const handlePageChange = useCallback((pageNumber: number) => {
        setCurrentPage(pageNumber);
        // 페이지 변경 시 스크롤을 맨 위로 이동
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    // 카테고리나 검색어 변경 시 첫 페이지로 이동
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchTag]);

    if (loading) {
        return (
            <div className="board-container">
                <div className="loading-container">
                    <div className="loading-title">게시글을 불러오는 중...</div>
                    <div className="loading-subtitle">잠시만 기다려주세요</div>
                </div>
            </div>
        );
    }

    return (
        <div className="board-container">
            <aside className="category-sidebar">
                <h3>카테고리</h3>
                <ul>
                    {getCurrentBoardCategories().map((cat) => (
                        <li
                            key={cat}
                            className={cat === selectedCategory ? "active" : ""}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="board-content">
                <div className="board-header">
                    <div className="post-count-wrapper">
                        <div className="post-count">
                            전체 게시글{" "}
                            <span className="count">{filteredData.length}</span>
                        </div>
                        {(isLoggedIn || isUserLoggedIn) && (
                            <button
                                className="create-post-button"
                                onClick={handleWriteClick}
                            >
                                글쓰기
                            </button>
                        )}
                    </div>
                    <input
                        className="tag-search-input"
                        type="text"
                        placeholder="태그로 검색"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                    />
                </div>

                <div className="card-list">
                    {currentPosts.length === 0 ? (
                        <div className="empty-data-container">
                            <div className="empty-data-title">
                                게시글이 없습니다
                            </div>
                            <div className="empty-data-subtitle">
                                총 {filteredData.length}개의 데이터 중 검색
                                결과가 없습니다
                            </div>
                        </div>
                    ) : (
                        currentPosts.map((post) => (
                            <div
                                className="card"
                                key={post.id}
                                onClick={() =>
                                    post.id && handlePostClick(post.id)
                                }
                                style={{ cursor: "pointer" }}
                            >
                                <div className="card-header">
                                    <h4 className="card-title">{post.title}</h4>
                                    <span className="card-category">
                                        [{post.category}]
                                    </span>
                                </div>

                                {post.content && (
                                    <p className="card-content">
                                        {post.content.length > 100
                                            ? `${post.content.substring(
                                                  0,
                                                  100,
                                              )}...`
                                            : post.content}
                                    </p>
                                )}

                                <div className="card-meta">
                                    {post.nickName && (
                                        <span className="card-author">
                                            작성자: {post.nickName}
                                        </span>
                                    )}
                                    {post.createdAt && (
                                        <span className="card-date">
                                            {formatDate(post.createdAt)}
                                        </span>
                                    )}
                                </div>

                                <div className="tag-list">
                                    {getTagsArray(post.tags).map((tag) => (
                                        <span key={tag} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 페이지네이션 */}
                <div className="pagination-container">
                    <div className="pagination-info">
                        페이지 {currentPage} / {totalPages}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? "active" : ""}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        다음
                    </button>
                </div>
            </main>
        </div>
    );
}
