import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ItBoardPage from "../pages/section/it-board-page";
import JapaneseBoardPage from "../pages/section/japanese-board-page";
import CultureBoardPage from "../pages/section/culture-board-page";

import AdminLogin from "../pages/login/adminLogin";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/it-board-page" element={<ItBoardPage />} />
            <Route
                path="/japanese-board-page"
                element={<JapaneseBoardPage />}
            />
            <Route path="/culture-board-page" element={<CultureBoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            {/* Culture 보드도 같은 방식으로 추가 */}
            {/* ... */}
        </Routes>
    );
}
