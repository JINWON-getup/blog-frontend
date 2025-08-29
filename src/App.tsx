import { ThemeProvider } from "./components/ThemeContext";
import { AdminProvider } from "./contexts/AdminContext";
import { UserProvider } from "./contexts/UserContext";

import AppRoutes from "./routes/routes";

import Header from "./components/common/Header";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";

export default function App() {
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
