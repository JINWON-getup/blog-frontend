import { Link } from "react-router-dom";
import itImg from "../assets/images/section_article_card-IT.jfif";
import japaneseImg from "../assets/images/section_article_card-japanese.jfif";
import dailyImg from "../assets/images/section_article_card-daily.jfif";
import { useAdmin } from "../contexts/AdminContext";
import "../css/contents.css";

export default function Contents() {
    const { isLoggedIn } = useAdmin();

    console.log("Contents 컴포넌트 렌더링됨");
    console.log("관리자 로그인 상태:", isLoggedIn);
    console.log("이미지 경로들:", { itImg, japaneseImg, dailyImg });

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
