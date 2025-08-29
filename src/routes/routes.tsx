import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Blog from "../pages/Blog";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import CreatePost from "../components/forms/CreatePost";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import MyPage from "../pages/MyPage";
import PostDetail from "../pages/Post/PostDetail";
import BoardPage from "../pages/Board/BoardPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/write" element={<CreatePost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/:boardType" element={<BoardPage />} />
        </Routes>
    );
}
