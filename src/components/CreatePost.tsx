import React, { useState } from "react";
import { createPost } from "../services/api";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPost({ title, content, author });
        alert("게시글이 등록되었습니다!");
        setTitle("");
        setContent("");
        setAuthor("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                required
            />
            <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자"
                required
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                required
            />
            <button type="submit">등록</button>
        </form>
    );
};

export default CreatePost;
