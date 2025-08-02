import { Link } from "react-router-dom";
import DarkModeToggle from "./darkmode-toggle"; // 토글 컴포넌트 import
import "../css/nav-bar.css";

export default function NavBar() {
    return (
        <nav className="nav-bar">
            <ul className="nav-list">
                <li>
                    <Link to="/" className="nav-link">
                        <i className="bi bi-house-door"></i>
                        <span>Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/about" className="nav-link">
                        <i className="bi bi-person"></i>
                        <span>About</span>
                    </Link>
                </li>
                <li>
                    <Link to="/blog" className="nav-link">
                        <i className="bi bi-journal-text"></i>
                        <span>Blog</span>
                    </Link>
                </li>
            </ul>
            <div className="nav-toggle">
                <DarkModeToggle />
            </div>
        </nav>
    );
}
