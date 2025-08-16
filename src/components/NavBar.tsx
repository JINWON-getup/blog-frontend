import { Link } from "react-router-dom";
import DarkModeToggle from "../components/Darkmode-toggle";
import { useAdmin } from "../contexts/AdminContext";
import "../css/nav-bar.css";

export default function NavBar() {
    const { adminInfo, isLoggedIn } = useAdmin();

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
                <li>
                    <Link to="/japanese" className="nav-link">
                        <i className="bi bi-translate"></i>
                        <span>Japanese</span>
                    </Link>
                </li>
                <li>
                    <Link to="/culture" className="nav-link">
                        <i className="bi bi-globe"></i>
                        <span>Culture</span>
                    </Link>
                </li>
                <li>
                    <Link to="/daily" className="nav-link">
                        <i className="bi bi-calendar-heart"></i>
                        <span>Daily</span>
                    </Link>
                </li>
            </ul>
            <div className="nav-toggle">
                {/* 관리자 메뉴 - 로그인된 관리자에게만 표시 */}
                {isLoggedIn && adminInfo && (
                    <Link to="/admin-dashboard" className="nav-link admin-link">
                        <i className="bi bi-speedometer2"></i>
                        <span>대시보드</span>
                    </Link>
                )}
                <DarkModeToggle />
            </div>
        </nav>
    );
}
