import {
    createContext,
    useContext,
    useState,
    type ReactElement,
    useEffect,
} from "react";

import type { AdminInfo } from "../services/api";

interface AdminContextType {
    adminInfo: AdminInfo | null;
    setAdminInfo: (info: AdminInfo | null) => void;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (info: AdminInfo) => void;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({
    children,
}: {
    children: ReactElement | ReactElement[];
}) => {
    const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 컴포넌트 마운트 시 localStorage에서 관리자 정보 복원
    useEffect(() => {
        const savedAdminInfo = localStorage.getItem("adminInfo");

        if (savedAdminInfo) {
            try {
                const parsedInfo = JSON.parse(savedAdminInfo);
                setAdminInfo(parsedInfo);
            } catch (error) {
                console.error("저장된 관리자 정보 파싱 실패:", error);
                localStorage.removeItem("adminInfo");
            }
        }

        // 로딩 완료
        setIsLoading(false);
    }, []);

    const login = (info: AdminInfo) => {
        setAdminInfo(info);
        localStorage.setItem("adminInfo", JSON.stringify(info));
    };

    const logout = () => {
        setAdminInfo(null);
        localStorage.removeItem("adminInfo");
    };

    const isLoggedIn = !!adminInfo;

    return (
        <AdminContext.Provider
            value={{
                adminInfo,
                setAdminInfo,
                isLoggedIn,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within AdminProvider");
    }
    return context;
};
