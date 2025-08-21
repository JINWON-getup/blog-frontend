import { useTheme } from "../ThemeContext";

export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="theme-toggle-button">
            <div className="toggle-container">
                <div className={`toggle-icon ${isDark ? "dark" : "light"}`}>
                    {isDark ? (
                        <i className="bi bi-sun-fill"></i>
                    ) : (
                        <i className="bi bi-moon-fill"></i>
                    )}
                </div>
                <span className="toggle-text">
                    {isDark ? "출근하기" : "야근하기"}
                </span>
            </div>
        </button>
    );
}