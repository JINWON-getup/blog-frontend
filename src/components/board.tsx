import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/board.css";
import type { Post } from "../data/_data";

// Board 컴포넌트가 받을 props의 타입을 정의합니다.
interface BoardProps {
    boardData: Post[];
    categories: string[];
    boardType: string; // 👈 [추가] 게시판 타입을 prop으로 받습니다.
}

// props로 boardData, categories, boardType을 받습니다.
export default function Board({
    boardData,
    categories,
    boardType,
}: BoardProps) {
    const { isLoggedIn } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchTag, setSearchTag] = useState("");

    useEffect(() => {
        setSelectedCategory("전체");
        setSearchTag("");
    }, [boardData, categories]);

    const filteredData = (boardData || []).filter((post) => {
        const categoryMatch =
            selectedCategory === "전체" || post.category === selectedCategory;
        const tagMatch =
            searchTag === "" ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(searchTag.toLowerCase()),
            );
        return categoryMatch && tagMatch;
    });

    return (
        <div className="board-container">
            <aside className="category-sidebar">
                <h3>카테고리</h3>
                <ul>
                    {categories.map((cat) => (
                        <li
                            key={cat}
                            className={cat === selectedCategory ? "active" : ""}
                            onClick={() => setSelectedCategory(cat)}
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
                        {/* 👇 [수정] boardType을 이용해 동적인 링크를 생성합니다. */}
                        {isLoggedIn && (
                            <Link
                                to={`/create-post/${boardType}`}
                                className="create-post-button"
                            >
                                작성하기
                            </Link>
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
                    {filteredData.map((post) => (
                        <Link
                            to={`/post/${post.id}`}
                            key={post.id}
                            className="card-link"
                        >
                            <div className="card" key={post.id}>
                                <h4>{post.title}</h4>
                                <p className="category">[{post.category}]</p>
                                <div className="tag-list">
                                    {post.tags.map((tag) => (
                                        <span key={tag} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
