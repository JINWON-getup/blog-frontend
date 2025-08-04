import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // 앱이 처음 시작될 때 localStorage의 토큰을 확인해서 로그인 상태를 설정합니다.
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // 로그인 함수
    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        // 로그인 성공 시 IT 게시판으로 이동합니다.
        navigate("/it");
    };

    // 로그아웃 함수 (나중에 필요할 때를 위해 미리 만듭니다)
    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 다른 컴포넌트에서 쉽게 로그인 상태를 가져다 쓸 수 있는 훅입니다.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};