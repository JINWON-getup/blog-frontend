import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <p>인증 상태를 확인 중입니다...</p>; // 로딩 중임을 명확히 표시
    }

    return isLoggedIn ? children : <Navigate to="/adminLogin" replace />;
};

export default PrivateRoute;
