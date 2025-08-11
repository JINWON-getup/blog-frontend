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
                        블로그입니다. IT, 일본어, 문화, 일상 등 다양한
                        카테고리로 구성되어 있습니다.
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
                            <p>JLPT, 문법, 회화 등 일본어 학습 관련 글</p>
                        </div>
                        <div className="category-item">
                            <h3>🌍 Culture</h3>
                            <p>다양한 문화와 관습에 대한 글</p>
                        </div>
                        <div className="category-item">
                            <h3>📅 Daily</h3>
                            <p>일상, 게임, 영화, 음악 등 생활 관련 글</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>연락처</h2>
                    <p>
                        궁금한 점이나 제안사항이 있으시면 언제든 연락주세요.
                        함께 성장하는 공간이 되었으면 합니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
