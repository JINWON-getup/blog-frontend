import Board from "../components/Board";
import "../css/blog.css";

export default function Blog() {
    return (
        <div className="blog-container">
            <div className="blog-header">
                <h1>📚 전체 블로그</h1>
                <p>모든 카테고리의 게시글을 한눈에 확인하세요</p>
            </div>
            <Board />
        </div>
    );
}
