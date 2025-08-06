import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ItBoardPage from "../pages/section/ItBoardPage";
import JapaneseBoardPage from "../pages/section/JapaneseBoardPage";
import CultureBoardPage from "../pages/section/CultureBoardPage";
import AdminLogin from "../pages/login/AdminLogin";
import CreatePostPage from "../pages/section/CreatePostPage"; // 👈 이 import가 있는지 확인
import EditPostPage from "../pages/section/EditPostPage"; //
import PrivateRoute from "../components/Private"; // 👈 이 import가 있는지 확인
import PostDetailPage from "../pages/section/PostDetailPage"; // 👈 이 import가 있는지 확인

export default function AppRoutes() {
    return (
        <Routes>
            {/* 기본 페이지 라우트 */}
            <Route path="/" element={<Home />} />
            <Route path="/it" element={<ItBoardPage />} />
            <Route path="/japanese" element={<JapaneseBoardPage />} />
            <Route path="/culture" element={<CultureBoardPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />

            {/* 👇 '작성하기' 페이지를 위한 보호된 라우트 */}
            <Route
                path="/create-post/:boardType"
                element={
                    <PrivateRoute>
                        <CreatePostPage />
                    </PrivateRoute>
                }
            />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
            <Route
                path="/create-post/:boardType"
                element={
                    <PrivateRoute>
                        <CreatePostPage />
                    </PrivateRoute>
                }
            />
            {/* 👇 2. 수정 페이지를 위한 보호된 Route 추가 */}
            <Route
                path="/edit-post/:id"
                element={
                    <PrivateRoute>
                        <EditPostPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
