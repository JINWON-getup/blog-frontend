import { Link } from "react-router-dom";
import itImg from "../assets/images/section_article_card-IT.jfif";
import japaneseImg from "../assets/images/section_article_card-japanese.jfif";
import { useAdmin } from "../contexts/AdminContext";
import "../css/contents.css";

export default function Contents() {
    const { isLoggedIn } = useAdmin();

    return (
        <section className="contents">
            <article className="article-card">
                <Link to="/it">
                    <img src={itImg} alt="IT" />
                    <p>IT</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/japanese">
                    <img src={japaneseImg} alt="Japanese" />
                    <p>Japanese</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/daily">
                    <img src={japaneseImg} alt="Daily" />
                    <p>Daily</p>
                </Link>
            </article>
            {isLoggedIn && (
                <article className="article-card write-card">
                    <Link to="/write">
                        <div className="write-icon">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </div>
                        <p>게시글 작성</p>
                    </Link>
                </article>
            )}
        </section>
    );
}
