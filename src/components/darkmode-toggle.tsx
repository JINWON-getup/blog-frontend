import { useTheme } from "../components/theme-context"; // 1. useEffect, useState 대신 useTheme을 import 합니다.

const ThemeToggle = () => {
    // 2. 복잡한 로직은 다 지우고, Context에서 필요한 것만 가져옵니다.
    const { isDark, toggleTheme } = useTheme();

    return (
        // 3. onClick에서는 toggleTheme 함수를 실행합니다.
        <button onClick={toggleTheme} className="darkmode-toggle">
            {isDark ? "☀️ 출근하기" : "🌙 야근하기"}
        </button>
    );
};  

export default ThemeToggle;
