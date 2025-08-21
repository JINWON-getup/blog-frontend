import { useTheme } from "../ThemeContext";

export default function ProfileImage() {
    const { isDark } = useTheme();

    return (
        <img
            src={
                isDark
                    ? "/images/profile-evening.png"
                    : "/images/profile-morning.png" 
            }
            alt="profile"
            className="profile-img"
        />
    );
}
