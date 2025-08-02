import { Link } from "react-router-dom";
import DarkModeToggle from "./darkmode-toggle";
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
                <li>
                    <Link to="/it" className="nav-link">
                        <i className="bi bi-cpu"></i>
                        <span>IT</span>
                    </Link>
                </li>
            </ul>
            <div className="nav-toggle">
                <DarkModeToggle />
            </div>
        </nav>
    );
}
