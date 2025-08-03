import { Link } from "react-router-dom";
import itImg from "../../assets/images/section_article_card-IT.jfif";
import japanImg from "../../assets/images/section_article_card-japan.jfif";
import cultureImg from "../../assets/images/section_article_card-culture.jfif";
import "../../css/contents.css";

export default function Contents() {
    return (
        <section className="contents">
            <article className="article-card">
                <Link to="/it-board-page">
                    <img src={itImg} alt="IT" />
                    <p>IT</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/japanese-board-page">
                    <img src={japanImg} alt="Japanese" />
                    <p>Japanese</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/culture-board-page">
                    <img src={cultureImg} alt="Culture" />
                    <p>Culture</p>
                </Link>
            </article>
        </section>
    );
}
