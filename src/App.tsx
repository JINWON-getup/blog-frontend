import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/NavBar";
import { ThemeProvider } from "./components/ThemeContext";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";

export default function App() {
    return (
        // 2. ThemeProvider로 전체를 감싸줍니다.
        <ThemeProvider>
            <Header />
            <NavBar />
            <main>
                <CreatePost />
                <PostList />
                <AppRoutes />
            </main>
            <Footer />
        </ThemeProvider>
    );
}
