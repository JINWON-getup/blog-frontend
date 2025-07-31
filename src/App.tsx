import Header from "./components/header";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";
import NavBar from "./components/nav-bar";

function App() {
    return (
        <>
            <Header />
            <NavBar />
            <main>
                <AppRoutes />
            </main>
            <Footer />
        </>
    );
}

export default App;
