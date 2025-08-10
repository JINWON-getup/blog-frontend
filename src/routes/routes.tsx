import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ItBoardPage from "../pages/section/ItBoardPage";
import JapaneseBoardPage from "../pages/section/JapaneseBoardPage";
import CultureBoardPage from "../pages/section/CultureBoardPage";
import DailyBoardPage from "../pages/section/DailyBoardPage";
import AdminLogin from "../pages/login/AdminLogin";
import CreatePost from "../components/CreatePost";
import PostDetail from "../pages/PostDetail";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/it" element={<ItBoardPage />} />
            <Route path="/japanese" element={<JapaneseBoardPage />} />
            <Route path="/culture" element={<CultureBoardPage />} />
            <Route path="/daily" element={<DailyBoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/write" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
    );
}
