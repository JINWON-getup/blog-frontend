import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ItBoardPage from "../pages/section/ItBoardPage";
import JapaneseBoardPage from "../pages/section/JapaneseBoardPage";
import CultureBoardPage from "../pages/section/CultureBoardPage";
import AdminLogin from "../pages/login/AdminLogin";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* 👇 path 경로를 짧게 수정 */}
            <Route path="/it" element={<ItBoardPage />} />
            <Route path="/japanese" element={<JapaneseBoardPage />} />
            <Route path="/culture" element={<CultureBoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
        </Routes>
    );
}
