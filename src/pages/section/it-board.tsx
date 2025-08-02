import { useState } from "react";
import "./it-board.css";

const dummyData = [
    {
        id: 1,
        title: "React로 블로그 만들기",
        category: "React",
        tags: ["React", "JS"],
    },
    {
        id: 2,
        title: "SpringBoot 게시판 구축",
        category: "SpringBoot",
        tags: ["Spring", "Java"],
    },
    {
        id: 3,
        title: "Tailwind로 스타일링",
        category: "Tailwind",
        tags: ["Tailwind", "CSS"],
    },
    // ...
];

const categories = ["전체", "React", "SpringBoot"];

export default function ItBoard() {
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [searchTag, setSearchTag] = useState("");

    const filteredData = dummyData.filter((post) => {
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
        <div className="it-board-container">
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

            <main className="it-board-content">
                <div className="board-header">
                    <div className="post-count">
                        전체 게시글{" "}
                        <span className="count">{filteredData.length}</span>
                    </div>
                    <input
                        type="text"
                        placeholder="태그로 검색"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        className="tag-search-input"
                    />
                </div>

                <div className="card-list">
                    {filteredData.map((post) => (
                        <div className="it-card" key={post.id}>
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
