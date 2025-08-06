import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axiosConfig";
import "../../css/post-detail-page.css"; // 글쓰기 폼 CSS 재사용
import {
    itCategories,
    japaneseCategories,
    cultureCategories,
} from "../../data/_data";

// 👇 [추가] API로부터 받아올 데이터의 타입을 명확하게 정의합니다.
interface PostFromApi {
    id: number;
    title: string;
    boardType: string;
    category: string;
    content: string;
    tags: string;
}

export default function EditPostPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [boardType, setBoardType] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const [currentCategories, setCurrentCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // 👇 [수정] axios.get 요청 시, 받아올 데이터가 PostFromApi 타입이라고 명시합니다.
                const response = await axios.get<PostFromApi>(
                    `/api/posts/${id}`,
                );
                const post = response.data; // 이제 post는 PostFromApi 타입으로 안전하게 인식됩니다.

                setTitle(post.title);
                setBoardType(post.boardType);
                setCategory(post.category);
                setTags(post.tags);
                setContent(post.content);
            } catch (error) {
                console.error("게시글 정보를 불러오는데 실패했습니다.", error);
                alert("게시글 정보를 불러올 수 없습니다.");
            }
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (!boardType) return;
        let categories: string[] = [];
        if (boardType === "it") categories = itCategories;
        else if (boardType === "japanese") categories = japaneseCategories;
        else if (boardType === "culture") categories = cultureCategories;
        setCurrentCategories(categories.filter((cat) => cat !== "전체"));
    }, [boardType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const postData = { title, boardType, category, tags, content };
        try {
            await axios.put(`/api/posts/${id}`, postData);
            alert("게시글이 성공적으로 수정되었습니다.");
            navigate(`/post/${id}`);
        } catch (error) {
            console.error("게시글 수정에 실패했습니다.", error);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <h2>게시글 수정</h2>
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
                        수정 완료
                    </button>
                </div>
            </form>
        </div>
    );
}
