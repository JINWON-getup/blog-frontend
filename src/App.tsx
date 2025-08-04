import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from "./components/AuthContext"; // 👈 1. AuthProvider를 import

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                {" "}
                {/* 👈 2. ThemeProvider 안쪽에 AuthProvider를 추가 */}
                <Header />
                <NavBar />
                <main>
                    <AppRoutes />
                </main>
                <Footer />
            </AuthProvider>
        </ThemeProvider>
    );
}
