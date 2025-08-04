import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ItBoardPage from "../pages/section/ItBoardPage";
import JapaneseBoardPage from "../pages/section/JapaneseBoardPage";
import CultureBoardPage from "../pages/section/CultureBoardPage";
import AdminLogin from "../pages/login/AdminLogin";
import CreatePostPage from "../pages/section/CreatePostPage";
import PrivateRoute from "../components/Private"; // 👈 1. PrivateRoute를 import

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/it" element={<ItBoardPage />} />
            <Route path="/japanese" element={<JapaneseBoardPage />} />
            <Route path="/culture" element={<CultureBoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />

            {/* 👇 2. CreatePostPage를 PrivateRoute로 감싸줍니다. */}
            <Route
                path="/create-post"
                element={
                    <PrivateRoute>
                        <CreatePostPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
