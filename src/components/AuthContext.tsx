import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AuthContext: Checking for token...");
        const token = localStorage.getItem("token");
        if (token) {
            console.log(
                "AuthContext: Token found, setting isLoggedIn to true.",
            );
            setIsLoggedIn(true);
        } else {
            console.log("AuthContext: No token found.");
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        console.log("AuthContext: login function called.");
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
        navigate("/it");
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
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
