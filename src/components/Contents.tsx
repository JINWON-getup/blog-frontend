import { Link } from "react-router-dom";
import itImg from "../assets/images/section_article_card-IT.jfif";
import japanImg from "../assets/images/section_article_card-japan.jfif";
import cultureImg from "../assets/images/section_article_card-culture.jfif";
import "../css/contents.css";
import ScrollAnimation from "./ScrollAnimation";

export default function Contents() {
    return (
        <section className="contents">
            <ScrollAnimation animation="fade-up" delay={0.1}>
                <article className="article-card">
                    <Link to="/it">
                        <img src={itImg} alt="IT" />
                        <p>IT</p>
                    </Link>
                </article>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.2}>
                <article className="article-card">
                    <Link to="/japanese">
                        <img src={japanImg} alt="Japanese" />
                        <p>Japanese</p>
                    </Link>
                </article>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-up" delay={0.3}>
                <article className="article-card">
                    <Link to="/culture">
                        <img src={cultureImg} alt="Culture" />
                        <p>Culture</p>
                    </Link>
                </article>
            </ScrollAnimation>
        </section>
    );
}
