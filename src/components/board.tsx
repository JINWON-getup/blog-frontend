import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "../css/board.css";

// 게시글(Post) 데이터의 타입을 정의합니다.
interface Post {
    id: number;
    title: string;
    category: string;
    tags: string[];
}

// Board 컴포넌트가 받을 props의 타입을 정의합니다.
interface BoardProps {
    boardData: Post[];
    categories: string[];
}

// props로 boardData와 categories를 받습니다.
export default function Board({ boardData, categories }: BoardProps) {
    const { isLoggedIn } = useAuth(); // 로그인 상태를 가져옵니다.
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchTag, setSearchTag] = useState("");

    useEffect(() => {
        // boardData나 categories가 바뀔 때마다 필터를 초기화합니다.
        setSelectedCategory("전체");
        setSearchTag("");
    }, [boardData, categories]);

    // boardData가 아직 없으면 빈 배열([])을 사용하도록 안전장치를 추가합니다.
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
                        {isLoggedIn && (
                            <Link
                                to="/create-post"
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
                    ))}
                </div>
            </main>
        </div>
    );
}
