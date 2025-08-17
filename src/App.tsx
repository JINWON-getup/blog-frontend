import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
import { AdminProvider } from "./contexts/AdminContext";
import { UserProvider } from "./contexts/UserContext";

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
