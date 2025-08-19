import "../css/about.css";

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">About JINmono</h1>

                <section className="about-section">
                    <h2>안녕하세요! 👋</h2>
                    <p>
                        JINmono는 다양한 주제의 지식과 경험을 공유하는
                        블로그입니다.
                        <br /> IT, 일본, 일상 등 다양한 카테고리로 구성되어
                        있습니다.
                    </p>
                </section>

                <section className="about-section">
                    <h2>주요 카테고리</h2>
                    <div className="category-grid">
                        <div className="category-item">
                            <h3>💻 IT</h3>
                            <p>
                                프론트엔드, 백엔드, 데이터베이스 등 기술 관련 글
                            </p>
                        </div>
                        <div className="category-item">
                            <h3>🇯🇵 Japanese</h3>
                            <p>일본어, 문화 등 일본 관련 글</p>
                        </div>
                        <div className="category-item">
                            <h3>📅 Daily</h3>
                            <p>일상, 게임, 애니메이션, 음악 등 생활 관련 글</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
