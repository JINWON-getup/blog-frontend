import Header from "./components/header";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/nav-bar";
import { ThemeProvider } from "./components/theme-context"; // 1. ThemeProvider를 import 합니다.

function App() {
    return (
        // 2. ThemeProvider로 전체를 감싸줍니다.
        <ThemeProvider>
            <Header />
            <NavBar />
            <main>
                <AppRoutes />
            </main>
            <Footer />
        </ThemeProvider>
    );
}

export default App;
