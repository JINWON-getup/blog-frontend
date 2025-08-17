import {
    createContext,
    useContext,
    useState,
    type ReactElement,
    useEffect,
} from "react";

interface UserInfo {
    userId: string;
    nickName: string;
    email: string;
    pid: number;
}

interface UserContextType {
    userInfo: UserInfo | null;
    setUserInfo: (info: UserInfo | null) => void;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (info: UserInfo) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
    children,
}: {
    children: ReactElement | ReactElement[];
}) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");

        if (savedUserInfo) {
            try {
                const parsedInfo = JSON.parse(savedUserInfo);
                setUserInfo(parsedInfo);
            } catch (error) {
                console.error("저장된 사용자 정보 파싱 실패:", error);
                localStorage.removeItem("userInfo");
            }
        }

        setIsLoading(false);
    }, []);

    const login = (info: UserInfo) => {
        console.log("UserContext login 호출됨:", info);
        setUserInfo(info);
        localStorage.setItem("userInfo", JSON.stringify(info));
        console.log("UserContext 상태 업데이트 완료, userInfo:", info);
        console.log("localStorage 저장 완료");
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem("userInfo");
    };

    const isLoggedIn = !!userInfo;

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                isLoggedIn,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};
