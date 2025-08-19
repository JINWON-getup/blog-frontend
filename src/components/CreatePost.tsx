import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPost } from "../services/api";
import { useAdmin } from "../contexts/AdminContext";
import { useUser } from "../contexts/UserContext";
import "../css/createPost.css";

const CreatePost: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { adminInfo, isLoggedIn: isAdminLoggedIn } = useAdmin();
    const { userInfo, isLoggedIn: isUserLoggedIn } = useUser();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [boardType, setBoardType] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    // 로그인 상태 확인
    useEffect(() => {
        if (!isAdminLoggedIn && !isUserLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
    }, [isAdminLoggedIn, isUserLoggedIn, navigate]);

    // URL state에서 boardType을 받아와서 초기값 설정
    useEffect(() => {
        if (location.state?.boardType) {
            const boardTypeFromState = location.state.boardType.toLowerCase();
            setBoardType(boardTypeFromState);
            // 고정된 게시판이 있는 경우 카테고리 초기화
            setCategory("");
        }
    }, [location.state]);

    // 게시판별 카테고리 매핑
    const boardCategories = {
        it: ["Frontend", "Backend", "Database", "기타"],
        japanese: ["JLPT", "문법", "회화", "기타"],
        culture: ["문화", "기타"],
        daily: ["일상", "게임", "영화", "드라마", "애니메이션", "음악", "기타"],
    };

    // 게시판별 라우트 매핑
    const boardRoutes = {
        it: "/it",
        japanese: "/japanese",
        culture: "/culture",
        daily: "/daily",
    };

    const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 고정된 게시판인 경우 변경 불가
        if (location.state?.boardType) {
            return;
        }
        const selectedBoard = e.target.value;
        setBoardType(selectedBoard);
        setCategory(""); // 게시판 변경 시 카테고리 초기화
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!tags.includes(newTag)) {
                if (tags.length >= 5) {
                    alert("태그는 최대 5개까지 추가할 수 있습니다.");
                    return;
                }
                if (newTag.length > 10) {
                    alert("태그는 최대 10글자까지 입력할 수 있습니다.");
                    return;
                }

                // 태그 추가 후 총 길이 검증
                const newTagsString = [...tags, newTag].join(", ");
                if (newTagsString.length > 80) {
                    alert(
                        "태그의 총 길이가 80자를 초과합니다. 태그를 추가할 수 없습니다.",
                    );
                    return;
                }

                setTags([...tags, newTag]);
                setTagInput("");
            }
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 고정된 게시판이 있는 경우 해당 게시판으로 설정
        const finalBoardType = location.state?.boardType
            ? location.state.boardType.toLowerCase()
            : boardType;

        const tagsString = tags.join(", ");

        // 태그 총 길이 검증 (데이터베이스 컬럼 길이 제한)
        if (tagsString.length > 80) {
            // 안전한 길이로 제한
            alert(
                "태그의 총 길이가 너무 깁니다. 태그 개수를 줄이거나 길이를 줄여주세요.",
            );
            return;
        }

        // userId 설정 - 더 안전한 검증 추가
        let userId: number;

        if (isAdminLoggedIn && adminInfo) {
            // adminInfo.id가 존재하는지 확인하고 숫자로 변환
            if (adminInfo.id && adminInfo.id !== "") {
                const parsedId = parseInt(adminInfo.id.toString());
                if (!isNaN(parsedId)) {
                    userId = parsedId;
                } else {
                    console.error(
                        "adminInfo.id를 숫자로 변환할 수 없음:",
                        adminInfo.id,
                    );
                    // 기본 관리자 ID 사용 (예: 9999)
                    userId = 9999;
                }
            } else {
                console.error("adminInfo.id가 비어있음:", adminInfo.id);
                // 기본 관리자 ID 사용 (예: 9999)
                userId = 9999;
            }
        } else {
            userId = userInfo?.pid || 0;
        }

        // userId가 유효한지 확인 (0이 아닌 경우만 허용)
        if (userId === 0) {
            alert("사용자 ID를 가져올 수 없습니다. 다시 로그인해주세요.");
            return;
        }

        // 디버깅을 위한 로그 추가
        console.log("게시글 생성 시도:", {
            title,
            content,
            boardType: finalBoardType,
            category,
            tags: tagsString,
            tagsLength: tagsString.length,
            userId,
            isAdminLoggedIn,
            adminInfo,
            userInfo,
        });

        try {
            const result = await createPost({
                userId,
                title,
                content,
                boardType: finalBoardType,
                category,
                tags: tagsString,
                nickName: userInfo?.nickName || "사용자",
            });

            console.log("게시글 생성 성공:", result);
            alert("게시글이 등록되었습니다!");

            // 폼 초기화
            setTitle("");
            setContent("");
            setBoardType("");
            setCategory("");
            setTags([]);
            setTagInput("");

            // 해당 보드로 이동
            if (
                finalBoardType &&
                boardRoutes[finalBoardType as keyof typeof boardRoutes]
            ) {
                navigate(
                    boardRoutes[finalBoardType as keyof typeof boardRoutes],
                );
            }
        } catch (error) {
            console.error("게시글 생성 실패:", error);
            alert(
                `게시글 등록에 실패했습니다: ${
                    error instanceof Error ? error.message : "알 수 없는 오류"
                }`,
            );
        }
    };

    return (
        <div className="create-post-container">
            {/* 뒤로가기 버튼 */}
            <div className="back-button-container">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    ← 뒤로가기
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* 게시판 선택 */}
                <div>
                    <label>
                        게시판 <span className="required">*</span>
                        {location.state?.boardType && (
                            <span className="fixed-indicator">(고정됨)</span>
                        )}
                    </label>
                    <div className="select-wrapper">
                        <select
                            value={boardType}
                            onChange={handleBoardChange}
                            required
                            disabled={!!location.state?.boardType}
                        >
                            <option value="">게시판을 선택하세요</option>
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
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            disabled={!boardType}
                        >
                            <option value="">
                                {boardType
                                    ? "카테고리를 선택하세요"
                                    : "게시판을 먼저 선택하세요"}
                            </option>
                            {boardType &&
                                boardCategories[
                                    boardType as keyof typeof boardCategories
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
                    <label>
                        제목 <span className="required">*</span>
                    </label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                        maxLength={50}
                    />
                    <div className="char-counter">{title.length}/50</div>
                </div>
                {/* 내용 */}
                <div>
                    <label>
                        내용 <span className="required">*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                        rows={10}
                        maxLength={2000}
                    />
                    <div className="char-counter">{content.length}/2000</div>
                </div>
                {/* 태그 */}
                <div>
                    <label>
                        태그{" "}
                        <span className="tag-limit">
                            (최대 5개, 각 태그 10글자, 총 길이 80글자)
                        </span>
                    </label>
                    <div className="tag-input-container">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleAddTag}
                            placeholder="태그를 입력하고 Enter를 누르세요"
                            className="tag-input"
                            disabled={tags.length >= 5}
                            maxLength={10}
                        />
                        <div className="char-counter">{tagInput.length}/10</div>
                        <div className="tag-list">
                            {tags.map((tag, index) => (
                                <span key={index} className="tag">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="tag-remove"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        {tags.length >= 5 && (
                            <div className="tag-limit-message">
                                태그 최대 개수에 도달했습니다
                            </div>
                        )}
                        {/* 태그 총 길이 표시 */}
                        <div className="tag-total-length">
                            태그 총 길이: {tags.join(", ").length}/80
                        </div>
                    </div>
                </div>
                {/* 작성자 + 버튼 */}
                <div className="form-row">
                    <div className="author-input">
                        {(adminInfo || userInfo) && (
                            <div className="admin-info-display">
                                <label>작성자</label>
                                <div className="admin-author-info">
                                    <span className="admin-name">
                                        {isAdminLoggedIn
                                            ? adminInfo?.adminName || "관리자"
                                            : userInfo?.nickName ||
                                              userInfo?.userId ||
                                              "사용자"}
                                    </span>
                                    <span className="admin-role">
                                        {isAdminLoggedIn ? "관리자" : "사용자"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button type="submit" className="submit-button">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
