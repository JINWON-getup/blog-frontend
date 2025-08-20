import { useEffect } from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/common/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
import { AdminProvider } from "./contexts/AdminContext";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
    useEffect(() => {
        console.log("App 컴포넌트 마운트됨");
    }, []);

    return (
        <ThemeProvider>
            <AdminProvider>
                <UserProvider>
                    <Header />
                    <NavBar />
                    <main>
                        <AppRoutes />
                    </main>
                    <Footer />
                </UserProvider>
            </AdminProvider>
        </ThemeProvider>
    );
}
