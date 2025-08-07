import React, { useState } from "react";
import { createPost } from "../services/api";
import "../css/createPost.css";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPost({ title, content, author, category });
        alert("게시글이 등록되었습니다!");
        setTitle("");
        setContent("");
        setAuthor("");
        setCategory("");
    };

    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit}>
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
                        >
                            <option value="">카테고리를 선택하세요</option>
                            <option value="IT">IT</option>
                            <option value="일본어">일본어</option>
                            <option value="문화">문화</option>
                            <option value="일상">일상</option>
                            <option value="기타">기타</option>
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
                    />
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
                    />
                </div>
                {/* 작성자 + 버튼 */}
                <div className="form-row">
                    <div className="author-input">
                        <label>
                            작성자 <span className="required">*</span>
                        </label>
                        <input
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="작성자"
                            required
                        />
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
