import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, isLoading } = useAuth();

    console.log(
        `PrivateRoute check: isLoading=${isLoading}, isLoggedIn=${isLoggedIn}`,
    );

    if (isLoading) {
        console.log("PrivateRoute: Auth state is loading, waiting...");
        return <p>인증 상태를 확인 중입니다...</p>; // 로딩 중임을 명확히 표시
    }

    if (!isLoggedIn) {
        console.log("PrivateRoute: Not logged in, redirecting to /adminLogin");
        return <Navigate to="/adminLogin" replace />;
    }

    console.log("PrivateRoute: Logged in, showing protected content.");
    return children;
};

export default PrivateRoute;
