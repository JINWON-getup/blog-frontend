import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Intro from "../pages/section/intro";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/intro" element={<Intro />} />
        </Routes>
    );
}
