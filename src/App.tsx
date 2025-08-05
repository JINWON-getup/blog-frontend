import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from "./components/AuthContext";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
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

export default App;
