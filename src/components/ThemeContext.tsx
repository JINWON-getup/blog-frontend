import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

// 시스템 테마 자동 감지 및 초기 테마 설정
const getInitialTheme = () => {
    if (typeof window !== "undefined" && window.localStorage) {
        const savedTheme = window.localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        // 저장된 테마가 있으면 그것을 사용
        if (savedTheme === "dark") return true;
        if (savedTheme === "light") return false;

        // 저장된 테마가 없으면 시스템 설정을 따름
        return prefersDark;
    }
    return false;
};

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(getInitialTheme());

    // HTML 클래스 적용
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem("theme", newIsDark ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
