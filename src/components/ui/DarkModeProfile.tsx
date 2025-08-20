// 1. useState와 useEffect를 지우고, useTheme 훅을 가져옵니다.
import { useTheme } from "../ThemeContext";

export default function ProfileImage() {
    // 2. Context에서 isDark 상태만 가져옵니다.
    const { isDark } = useTheme();

    return (
        <img
            src={
                // 3. Context에서 가져온 isDark 값으로 이미지를 결정합니다.
                isDark
                    ? "/images/profile-evening.png" // 🌙 밤 이미지
                    : "/images/profile-morning.png" // ☀️ 낮 이미지
            }
            alt="profile"
            className="profile-img"
        />
    );
}
