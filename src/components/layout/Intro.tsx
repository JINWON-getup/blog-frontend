import { useEffect, useState } from "react";
import { useTheme } from "../ThemeContext";
import profileMorning from "../../assets/images/profile-morning.png";
import profileNight from "../../assets/images/profile-evening.png";
import "../../css/intro.css";

export default function Intro() {
    const { isDark } = useTheme();

    const [currentImage, setCurrentImage] = useState(
        isDark ? profileNight : profileMorning,
    );
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (currentImage === (isDark ? profileNight : profileMorning)) return;

        setIsFading(true);

        setTimeout(() => {
            setCurrentImage(isDark ? profileNight : profileMorning);
            setIsFading(false);
        }, 100);
    }, [isDark, currentImage]);

    return (
        <section className="intro-section">
            <div className="intro-container">
                <img
                    src={currentImage}
                    alt="profile"
                    className={`intro-image ${
                        isFading ? "opacity-0" : "opacity-100"
                    }`}
                />
                <h1 className="intro-title">JINmono</h1>
                <p className="intro-description">
                    일본말하는 국문과 프로그래머의
                    <br />
                    눈물겨운 일본 취업 여행기
                </p>
            </div>
        </section>
    );
}
