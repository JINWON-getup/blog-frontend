import Header from "./components/header";
import DarkModeToggle from "./components/darkmode-toggle";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/nav-bar";

function App() {
    return (
        <>
            <Header />
            <DarkModeToggle />
            <NavBar />
            <main>
                <AppRoutes />
            </main>
            <Footer />
        </>
    );
}

export default App;
