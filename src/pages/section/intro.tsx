import { useEffect, useState } from "react";
import { useTheme } from "../../components/theme-context"; // 1. useTheme 훅 가져오기
import profileMorning from "../../assets/images/profile-morning.png";
import profileNight from "../../assets/images/profile-evening.png";

export default function Intro() {
    // 2. isDark 상태는 Context에서 가져옵니다.
    const { isDark } = useTheme();

    // 3. 화면에 실제로 보여줄 이미지와 페이드 효과를 위한 상태는 컴포넌트 내에 유지합니다.
    const [currentImage, setCurrentImage] = useState(
        isDark ? profileNight : profileMorning,
    );
    const [isFading, setIsFading] = useState(false);

    // 4. Context의 isDark 값이 바뀔 때마다 페이드 효과를 실행하도록 useEffect를 수정합니다.
    useEffect(() => {
        // 이미지가 이미 올바른 상태이면 아무 작업도 하지 않습니다.
        if (currentImage === (isDark ? profileNight : profileMorning)) return;

        setIsFading(true); // 이미지를 투명하게 만들어 fade-out 시작

        // CSS의 transition 시간(duration-500)과 비슷하게 시간을 설정합니다.
        setTimeout(() => {
            setCurrentImage(isDark ? profileNight : profileMorning); // 이미지 교체
            setIsFading(false); // 이미지를 다시 보이게 만들어 fade-in 시작
        }, 100);
    }, [isDark]); // Context의 isDark 값이 변경될 때만 이 코드가 실행됩니다.

    return (
        <section className="w-[1160px] mx-auto pt-[80px] pb-[40px] mt-3">
            <div className="flex flex-col items-center">
                <img
                    src={currentImage} // 5. 컴포넌트 내부 상태에 따라 이미지를 표시합니다.
                    alt="profile"
                    className={`w-[150px] h-[150px] rounded-[3px] mb-4 transition-opacity duration-500 ${
                        isFading ? "opacity-0" : "opacity-100"
                    }`}
                />
                <h1 className="text-2xl font-bold">JINmono</h1>
                <p className="mt-2 leading-relaxed text-center">
                    일본말하는 국문과 프로그래머의
                    <br />
                    눈물겨운 일본 취업 여행기
                </p>
            </div>
        </section>
    );
}
