import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Intro from "../pages/section/intro";
import It from "../pages/section/it-board";
import AdminLogin from "../pages/login/adminLogin";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/it" element={<It />} />
            <Route path="/adminLogin" element={<AdminLogin />} />
        </Routes>
    );
}
