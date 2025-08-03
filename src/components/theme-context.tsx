import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

// Context에 어떤 값이 들어갈지 타입을 정의합니다.
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

// Context를 생성합니다.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 다른 컴포넌트들을 감싸줄 Provider 컴포넌트를 만듭니다.
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    // 이 로직은 원래 ThemeToggle에 있던 것을 그대로 가져온 것입니다.
    // 앱이 처음 시작될 때 테마를 설정합니다.
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        } else {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    // 테마를 바꾸는 함수입니다.
    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // isDark 상태와 toggleTheme 함수를 모든 자식들에게 공유합니다.
    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 다른 컴포넌트에서 쉽게 Context 값을 가져다 쓸 수 있도록 도와주는 커스텀 훅입니다.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
