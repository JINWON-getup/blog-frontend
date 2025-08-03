import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="h-[100px] flex justify-center items-center border-t border-[#ddd]">
            <p>
                made by{" "}
                <Link
                    to="/adminLogin"
                    style={{ textDecoration: "none", color: "#333333" }}
                >
                    Kim Jin Won
                </Link>
            </p>
        </footer>
    );
}
