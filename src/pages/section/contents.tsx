import { Link } from "react-router-dom";
import itImg from "../../assets/images/section_article_card-IT.jfif";
import japanImg from "../../assets/images/section_article_card-japan.jfif";
import cultureImg from "../../assets/images/section_article_card-culture.jfif";

export default function Contents() {
    return (
        <section className="contents">
            <article className="article-card">
                <Link to="/it">
                    <img src={itImg} alt="IT" />
                    <p>IT</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/japan">
                    <img src={japanImg} alt="Japan" />
                    <p>Japanese</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/culture">
                    <img src={cultureImg} alt="Culture" />
                    <p>Culture</p>
                </Link>
            </article>
        </section>
    );
}
