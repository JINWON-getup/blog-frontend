import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

// 1. 렌더링 전에 실행될 초기 테마 확인 함수를 만듭니다.
const getInitialTheme = () => {
    // 이 코드는 서버 사이드 렌더링 환경이 아닐 때만 실행되도록 방어 코드를 추가합니다.
    if (typeof window !== "undefined" && window.localStorage) {
        const savedTheme = window.localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        if (savedTheme === "dark") {
            return true;
        }
        if (savedTheme === "light") {
            return false;
        }
        // 저장된 테마가 없으면, 사용자 시스템 설정을 따릅니다.
        return prefersDark;
    }
    // 서버 환경이거나 localStorage를 사용할 수 없으면 기본값(라이트 모드)을 반환합니다.
    return false;
};

interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    // 2. useState의 초기값으로 위에서 만든 함수를 실행한 결과를 넣습니다.
    const [isDark, setIsDark] = useState(getInitialTheme());

    // 3. useEffect는 이제 <html> 태그에 클래스를 적용하는 역할만 담당합니다.
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
