import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axiosConfig";
import "../../css/create-post-page.css";
import {
    itCategories,
    japaneseCategories,
    cultureCategories,
} from "../../data/_data";

export default function CreatePostPage() {
    const { boardType } = useParams<{ boardType: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const [currentCategories, setCurrentCategories] = useState<string[]>([]);

    useEffect(() => {
        let categories: string[] = [];
        if (boardType === "it") categories = itCategories;
        else if (boardType === "japanese") categories = japaneseCategories;
        else if (boardType === "culture") categories = cultureCategories;

        const filteredCategories = categories.filter((cat) => cat !== "전체");
        setCurrentCategories(filteredCategories);

        if (filteredCategories.length > 0) {
            setCategory(filteredCategories[0]);
        }
    }, [boardType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category) {
            alert("카테고리를 선택해주세요.");
            return;
        }

        // 👇 [수정] postData에 boardType을 추가합니다.
        const postData = { title, boardType, category, tags, content };

        try {
            await axios.post("/api/posts", postData);
            alert("게시글이 성공적으로 등록되었습니다.");
            // 등록 후 해당 게시판으로 새로고침하며 이동합니다.
            window.location.href = `/${boardType}`;
        } catch (error) {
            console.error("게시글 등록에 실패했습니다.", error);
            alert("게시글 등록에 실패했습니다.");
        }
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <h2>게시글 작성</h2>

                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">카테고리</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        {currentCategories.length === 0 && (
                            <option value="">로딩 중...</option>
                        )}
                        {currentCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tags">태그 (쉼표로 구분)</label>
                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={15}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cancel-button"
                    >
                        취소
                    </button>
                    <button type="submit" className="submit-button">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}
