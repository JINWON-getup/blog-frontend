import { useEffect, useState } from "react";
import profileMorning from "../../assets/images/profile-morning.png";
import profileNight from "../../assets/images/profile-evening.png";

export default function Intro() {
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark"),
    );
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const isDarkMode =
                document.documentElement.classList.contains("dark");

            // 이미지 전환 시 페이드 아웃 → 이미지 교체 → 페이드 인
            setIsFading(true); // 1. 투명하게
            setTimeout(() => {
                setIsDark(isDarkMode); // 2. 이미지 교체
                setIsFading(false); // 3. 다시 보이게
            }, 180); // 300ms 동안 페이드 아웃
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="w-[1160px] mx-auto pt-[80px] pb-[40px] mt-3">
            <div className="flex flex-col items-center">
                <img
                    src={isDark ? profileNight : profileMorning}
                    alt="profile"
                    className={`w-[150px] h-[150px] rounded-[3px] mb-4 transition-opacity duration-500 ${
                        isFading ? "opacity-0" : "opacity-100"
                    }`}
                />
                <h1 className="text-2xl font-bold">JINmono</h1>
                <p className="text-center mt-2 leading-relaxed">
                    일본말하는 국문과 프로그래머의
                    <br />
                    눈물겨운 일본 취업 여행기
                </p>
            </div>
        </section>
    );
}
