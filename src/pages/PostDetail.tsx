import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/postDetail.css";

interface Post {
    id: number;
    title: string;
    category: string;
    tags: string[] | string;
    board_type?: string;
    content?: string;
    createdAt?: string;
    author?: string;
}

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        boardType: "",
        category: "",
        content: "",
        tags: "",
    });
    const [editTags, setEditTags] = useState<string[]>([]);
    const [editTagInput, setEditTagInput] = useState("");

    // 게시판별 카테고리 매핑 (CreatePost.tsx와 동일)
    const boardCategories = {
        it: ["Frontend", "Backend", "Database", "기타"],
        japanese: ["JLPT", "문법", "회화", "기타"],
        culture: ["문화", "기타"],
        daily: ["일상", "게임", "영화", "드라마", "애니메이션", "음악", "기타"],
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Post>(
                    `http://localhost:8080/api/posts/${id}`,
                );
                setPost(response.data);
                // 수정 폼 초기값 설정
                setEditForm({
                    title: response.data.title,
                    boardType: response.data.board_type || "",
                    category: response.data.category,
                    content: response.data.content || "",
                    tags: Array.isArray(response.data.tags)
                        ? response.data.tags.join(", ")
                        : response.data.tags || "",
                });
            } catch (error) {
                console.error("게시글을 불러오는 중 오류:", error);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleEdit = () => {
        if (!post) return;
        const tagsArray = getTagsArray(post.tags);
        setEditForm({
            title: post.title,
            boardType: post.board_type || "",
            category: post.category,
            content: post.content || "",
            tags: tagsArray.join(", "),
        });
        setEditTags(tagsArray);
        setEditTagInput("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // 원래 데이터로 복원
        if (post) {
            setEditForm({
                title: post.title,
                boardType: post.board_type || "",
                category: post.category,
                content: post.content || "",
                tags: Array.isArray(post.tags)
                    ? post.tags.join(", ")
                    : post.tags || "",
            });
        }
    };

    const handleSave = async () => {
        try {
            if (!post) {
                alert("게시글 정보를 찾을 수 없습니다.");
                return;
            }

            // 서버가 기대하는 형식으로 데이터 구성
            const updatedPost = {
                id: post.id,
                title: editForm.title,
                boardType: editForm.boardType,
                category: editForm.category,
                content: editForm.content,
                tags: editForm.tags, // 이미 문자열 형태이므로 그대로 사용
                author: post.author || "익명", // author가 없을 경우 기본값 설정
                createdAt: post.createdAt, // 기존 값 유지
            };

            console.log("수정할 데이터:", updatedPost);
            console.log("요청 URL:", `http://localhost:8080/api/posts/${id}`);

            const response = await axios.put(
                `http://localhost:8080/api/posts/${id}`,
                updatedPost,
            );

            console.log("서버 응답:", response.data);

            // 수정된 데이터로 상태 업데이트
            setPost(updatedPost as Post);
            setIsEditing(false);

            alert("게시글이 성공적으로 수정되었습니다!");
        } catch (error: unknown) {
            console.error("게시글 수정 중 오류:", error);

            // 더 자세한 에러 정보 출력
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response: {
                        status: number;
                        statusText: string;
                        data: unknown;
                    };
                };
                console.error("서버 응답 에러:", {
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    data: axiosError.response.data,
                });
                console.error(
                    "서버 에러 상세:",
                    JSON.stringify(axiosError.response.data, null, 2),
                );
                alert(
                    `게시글 수정에 실패했습니다. (${axiosError.response.status}: ${axiosError.response.statusText})`,
                );
            } else if (
                error &&
                typeof error === "object" &&
                "request" in error
            ) {
                console.error("요청 에러:", error);
                alert(
                    "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.",
                );
            } else {
                console.error("기타 에러:", error);
                alert(
                    `게시글 수정에 실패했습니다: ${
                        error instanceof Error
                            ? error.message
                            : "알 수 없는 오류"
                    }`,
                );
            }
        }
    };

    const handleDelete = async () => {
        if (!post) {
            alert("게시글 정보를 찾을 수 없습니다.");
            return;
        }

        // 사용자에게 삭제 확인 요청
        const isConfirmed = window.confirm(
            `"${post.title}" 게시글을 정말로 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
        );

        if (!isConfirmed) {
            return;
        }

        try {
            console.log(
                "삭제 요청 URL:",
                `http://localhost:8080/api/posts/${id}`,
            );

            const response = await axios.delete(
                `http://localhost:8080/api/posts/${id}`,
            );

            console.log("삭제 응답:", response.data);

            alert("게시글이 성공적으로 삭제되었습니다!");

            // 삭제 후 이전 페이지로 이동
            navigate(-1);
        } catch (error: unknown) {
            console.error("게시글 삭제 중 오류:", error);

            // 더 자세한 에러 정보 출력
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as {
                    response: {
                        status: number;
                        statusText: string;
                        data: unknown;
                    };
                };
                console.error("서버 응답 에러:", {
                    status: axiosError.response.status,
                    statusText: axiosError.response.statusText,
                    data: axiosError.response.data,
                });
                console.error(
                    "서버 에러 상세:",
                    JSON.stringify(axiosError.response.data, null, 2),
                );
                alert(
                    `게시글 삭제에 실패했습니다. (${axiosError.response.status}: ${axiosError.response.statusText})`,
                );
            } else if (
                error &&
                typeof error === "object" &&
                "request" in error
            ) {
                console.error("요청 에러:", error);
                alert(
                    "서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.",
                );
            } else {
                console.error("기타 에러:", error);
                alert(
                    `게시글 삭제에 실패했습니다: ${
                        error instanceof Error
                            ? error.message
                            : "알 수 없는 오류"
                    }`,
                );
            }
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddEditTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && editTagInput.trim()) {
            e.preventDefault();
            const newTag = editTagInput.trim();
            if (!editTags.includes(newTag)) {
                if (editTags.length >= 5) {
                    alert("태그는 최대 5개까지 추가할 수 있습니다.");
                    return;
                }
                if (newTag.length > 10) {
                    alert("태그는 최대 10글자까지 입력할 수 있습니다.");
                    return;
                }
                setEditTags([...editTags, newTag]);
                setEditForm((prev) => ({
                    ...prev,
                    tags: [...editTags, newTag].join(", "),
                }));
                setEditTagInput("");
            }
        }
    };

    const handleRemoveEditTag = (tagToRemove: string) => {
        const newTags = editTags.filter((tag) => tag !== tagToRemove);
        setEditTags(newTags);
        setEditForm((prev) => ({
            ...prev,
            tags: newTags.join(", "),
        }));
    };

    const getTagsArray = (tags: string[] | string): string[] => {
        if (Array.isArray(tags)) {
            return tags;
        }
        return tags ? tags.split(",").map((tag) => tag.trim()) : [];
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="post-detail-container">
                <div className="loading">게시글을 불러오는 중...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="post-detail-container">
                <div className="error">게시글을 찾을 수 없습니다.</div>
                <button onClick={() => navigate(-1)} className="back-button">
                    뒤로 가기
                </button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="create-post-container">
                <div className="post-header">
                    <button onClick={handleCancel} className="back-button">
                        ← 수정 취소
                    </button>
                    <h1 className="post-title">게시글 수정</h1>
                </div>

                <form className="edit-form">
                    {/* 게시판 선택 */}
                    <div>
                        <label>
                            게시판 <span className="required">*</span>
                            <span className="disabled-field-indicator">
                                (변경 불가)
                            </span>
                        </label>
                        <div className="select-wrapper">
                            <select
                                value={editForm.boardType || ""}
                                disabled
                                required
                                className="disabled-field"
                            >
                                <option value="it">IT</option>
                                <option value="japanese">일본어</option>
                                <option value="culture">문화</option>
                                <option value="daily">일상</option>
                            </select>
                            <span className="select-arrow">
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* 카테고리 */}
                    <div>
                        <label>
                            카테고리 <span className="required">*</span>
                        </label>
                        <div className="select-wrapper">
                            <select
                                value={editForm.category}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                required
                                disabled
                            >
                                {/* 현재 게시글의 카테고리가 옵션에 없을 경우를 대비해 추가 */}
                                {editForm.category && (
                                    <option
                                        key={editForm.category}
                                        value={editForm.category}
                                    >
                                        {editForm.category}
                                    </option>
                                )}
                                {editForm.boardType &&
                                    boardCategories[
                                        editForm.boardType as keyof typeof boardCategories
                                    ]?.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                            </select>
                            <span className="select-arrow">
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* 제목 */}
                    <div>
                        <label htmlFor="title">
                            제목 <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={editForm.title}
                            onChange={handleInputChange}
                            placeholder="제목을 입력하세요"
                            required
                            maxLength={50}
                        />
                        <div className="char-counter">
                            {editForm.title.length}/50
                        </div>
                    </div>

                    <div>
                        <label htmlFor="content">
                            내용 <span className="required">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={editForm.content}
                            onChange={handleInputChange}
                            placeholder="내용을 입력하세요"
                            required
                            rows={10}
                            maxLength={2000}
                        />
                        <div className="char-counter">
                            {editForm.content.length}/2000
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">
                            태그{" "}
                            <span className="tag-limit">
                                (최대 5개, 각 태그 10글자)
                            </span>
                        </label>
                        <div className="tag-input-container">
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={editTagInput}
                                onChange={(e) =>
                                    setEditTagInput(e.target.value)
                                }
                                onKeyPress={handleAddEditTag}
                                className="tag-input"
                                placeholder="태그를 입력하고 Enter를 누르세요"
                                disabled={editTags.length >= 5}
                                maxLength={10}
                            />
                            <div className="char-counter">
                                {editTagInput.length}/10
                            </div>
                            <div className="tag-list">
                                {editTags.map((tag, index) => (
                                    <span key={index} className="tag">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveEditTag(tag)
                                            }
                                            className="tag-remove"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {editTags.length >= 5 && (
                                <div className="tag-limit-message">
                                    태그 최대 개수에 도달했습니다
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="author-input">
                            <label>
                                작성자 <span className="required">*</span>
                                <span className="disabled-field-indicator">
                                    (변경 불가)
                                </span>
                            </label>
                            <input
                                value={post.author || "익명"}
                                disabled
                                placeholder="작성자"
                                className="disabled-field"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="submit-button"
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="post-detail-container">
            <div className="post-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    ← 뒤로 가기
                </button>
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    <span className="post-category">[{post.category}]</span>
                    {post.author && (
                        <span className="post-author">
                            작성자: {post.author}
                        </span>
                    )}
                    {post.createdAt && (
                        <span className="post-date">
                            {formatDate(post.createdAt)}
                        </span>
                    )}
                </div>
            </div>

            <div className="post-content">
                {post.content ? (
                    <div className="content-text">{post.content}</div>
                ) : (
                    <div className="no-content">내용이 없습니다.</div>
                )}
            </div>

            <div className="post-tags">
                {getTagsArray(post.tags).map((tag) => (
                    <span key={tag} className="tag">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="post-actions">
                <button onClick={handleEdit} className="edit-button">
                    수정
                </button>
                <button onClick={handleDelete} className="delete-button">
                    삭제
                </button>
            </div>
        </div>
    );
}
