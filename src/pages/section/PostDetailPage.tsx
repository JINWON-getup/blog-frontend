import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import type { Post } from "../../data/_data";
import { useAuth } from "../../components/AuthContext";
import "../../css/post-detail-page.css";

// API 응답을 위한 타입
interface PostFromApi {
    id: number;
    title: string;
    boardType: string;
    category: string;
    content: string;
    tags: string;
}

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get<PostFromApi>(
                    `/api/posts/${id}`,
                );
                const data = response.data;
                // tags를 배열로 변환합니다.
                const formattedPost: Post = {
                    ...data,
                    tags: data.tags
                        ? data.tags.split(",").map((tag) => tag.trim())
                        : [],
                };
                setPost(formattedPost);
            } catch (err) {
                setError("게시글을 불러올 수 없습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    // 삭제 버튼 클릭 시 실행될 함수
    const handleDelete = async () => {
        if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/posts/${id}`);
                alert("게시글이 삭제되었습니다.");
                if (post) {
                    navigate(`/${post.boardType}`); // 해당 게시판 목록으로 이동
                } else {
                    navigate("/"); // 만약을 대비한 기본 경로
                }
            } catch (error) {
                console.error("삭제에 실패했습니다.", error);
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    if (loading) {
        return (
            <div className="post-detail-container">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="post-detail-container">
                <p>{error}</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="post-detail-container">
                <p>게시글이 존재하지 않습니다.</p>
            </div>
        );
    }

    return (
        <div className="post-detail-container">
            <header className="post-header">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <span className="post-category">{post.category}</span>
                </div>
                <div className="post-tags">
                    {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            </header>
            <main
                className="post-content"
                dangerouslySetInnerHTML={{
                    __html: post.content.replace(/\n/g, "<br />"),
                }}
            />
            <footer className="post-footer">
                <Link to={`/${post.boardType}`} className="list-button">
                    목록
                </Link>
                {/* 로그인 상태일 때만 수정/삭제 버튼을 보여줍니다. */}
                {isLoggedIn && (
                    <div className="admin-actions">
                        <Link
                            to={`/edit-post/${post.id}`}
                            className="edit-button"
                        >
                            수정
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </footer>
        </div>
    );
}
