import { useEffect, useState } from "react";
import profileMorning from "../../assets/images/profile-morning.png";
import profileNight from "../../assets/images/profile-evening.png";

export default function Intro() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDarkMode = () => {
            const savedTheme = localStorage.getItem("theme");
            if (
                savedTheme === "dark" ||
                (!savedTheme &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
                setIsDark(true);
            } else {
                setIsDark(false);
            }
        };

        checkDarkMode();

        // 테마가 바뀌었을 때 감지
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const profileImage = isDark ? profileNight : profileMorning;

    return (
        <section className="w-[1160px] mx-auto pt-[80px] pb-[40px] mt-3">
            <div className="flex flex-col items-center">
                <img
                    src={profileImage}
                    alt="profile"
                    className="w-[150px] h-[150px] rounded-[3px] mb-4"
                />
                <h1 className="text-2xl font-bold">JINmono</h1>
                <p className="text-center mt-2 leading-relaxed">
                    일본말하는 국문과 프로그래머의
                    <br />
                    눈물겨운 일본취업 여행기
                </p>
            </div>
        </section>
    );
}
