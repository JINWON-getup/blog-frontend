import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import AdminLogin from "../pages/login/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import CreatePost from "../components/CreatePost";
import PostDetail from "../pages/PostDetail";
import BoardPage from "../pages/BoardPage";
import Register from "../pages/Register";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            {/* 기존 4개 라우트를 1개로 통합 */}
            <Route path="/:boardType" element={<BoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/write" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/signup" element={<Register />} />
        </Routes>
    );
}
