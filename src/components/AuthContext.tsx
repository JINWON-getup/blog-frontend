import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 앱이 처음 시작될 때, 백엔드에 로그인 상태를 물어봅니다.
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await axios.get("/api/auth/status");
                setIsLoggedIn(true); // 200 OK 응답을 받으면 로그인 상태로 설정
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setIsLoggedIn(false); // 401 등 에러 응답을 받으면 로그아웃 상태로 설정
            } finally {
                setIsLoading(false); // 상태 확인이 끝났으므로 로딩 종료
            }
        };
        checkAuthStatus();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            await axios.post("/api/login", { username, password });
            setIsLoggedIn(true);
            navigate("/it");
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout");
        } finally {
            setIsLoggedIn(false);
            navigate("/");
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
