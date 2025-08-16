import "./css/index.css"; // 1번째 (테일윈드 먼저)
import "bootstrap/dist/css/bootstrap.min.css"; // 2번째 (부트스트랩)
import "bootstrap-icons/font/bootstrap-icons.css"; // 3번째 (아이콘)
import "./css/theme-toggle.css"; // 4번째 (커스텀 CSS)
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
