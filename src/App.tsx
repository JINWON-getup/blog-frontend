import Header from "./components/header";
import Footer from "./components/footer";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <>
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
}

export default App;
