import profile from '../../assets/images/profile.png'

export default function Intro() {
    return(
        <section className="intro">
            <div className="profile">
                <img src={profile} alt="profile" />
                <h1>JINmono</h1>
                <p>
                    일본말하는 국문과 프로그래머의<br />
                    눈물겨운 일본취업 여행기
                </p>
            </div>
        </section>
    );
}