import { Link } from "react-router-dom";
import itImg from "../assets/images/section_article_card-IT.jfif";
import japanImg from "../assets/images/section_article_card-japan.jfif";
import cultureImg from "../assets/images/section_article_card-culture.jfif";
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
                    <img src={japanImg} alt="Japanese" />
                    <p>Japanese</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/culture">
                    <img src={cultureImg} alt="Culture" />
                    <p>Culture</p>
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
