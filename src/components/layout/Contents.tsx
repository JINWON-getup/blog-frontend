import { Link } from "react-router-dom";
import itImg from "../../assets/images/section_article_card-IT.jfif";
import japaneseImg from "../../assets/images/section_article_card-japanese.jfif";
import dailyImg from "../../assets/images/section_article_card-daily.jfif";
import "../../css/contents.css";

export default function Contents() {
    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement, Event>,
    ) => {
        console.error("이미지 로딩 실패:", e.currentTarget.src);
    };

    return (
        <section className="contents">
            <article className="article-card">
                <Link to="/it">
                    <img src={itImg} alt="IT" onError={handleImageError} />
                    <p>IT</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/japanese">
                    <img
                        src={japaneseImg}
                        alt="Japanese"
                        onError={handleImageError}
                    />
                    <p>Japanese</p>
                </Link>
            </article>
            <article className="article-card">
                <Link to="/daily">
                    <img
                        src={dailyImg}
                        alt="Daily"
                        onError={handleImageError}
                    />
                    <p>Daily</p>
                </Link>
            </article>
        </section>
    );
}
