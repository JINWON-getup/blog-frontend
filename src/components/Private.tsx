import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PrivateRoute 컴포넌트는 자식 컴포넌트(children)를 받습니다.
export default function Private({ children }: { children: ReactNode }) {
    // AuthContext를 사용해 현재 로그인 상태를 가져옵니다.
    const { isLoggedIn } = useAuth();

    // 만약 로그인 상태라면 자식 컴포넌트를 그대로 보여주고,
    // 아니라면 로그인 페이지로 보내버립니다.
    return isLoggedIn ? children : <Navigate to="/adminLogin" replace />;
}
