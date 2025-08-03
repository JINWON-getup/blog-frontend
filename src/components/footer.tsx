import { Link } from "react-router-dom";
import "../css/footer.css";

export default function Footer() {
    return (
        <footer className="footer-container">
            <p>
                made by{" "}
                <Link to="/adminLogin" className="footer-link">
                    Kim Jin Won
                </Link>
            </p>
        </footer>
    );
}
