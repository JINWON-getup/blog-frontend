import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/create-post-page.css"; // 아래에서 만들 CSS 파일

export default function CreatePostPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            title,
            category,
            tags: tags.split(",").map((tag) => tag.trim()),
            content,
        };
        console.log("새 게시글 데이터:", postData);
        // 실제 앱에서는 이 데이터를 백엔드 API로 전송합니다.
        alert("게시글이 (콘솔에) 등록되었습니다.");
        navigate(-1); // 이전 페이지(게시판)로 돌아가기
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
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    />
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
