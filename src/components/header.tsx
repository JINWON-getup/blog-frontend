export default function Header() {
    return (
        <header>
            <a href="/" className="header-link">
                <i className="bi bi-house-door"></i>
                <h1>JINmono</h1>
            </a>

            <button
                onClick={() =>
                    document.documentElement.classList.toggle("dark")
                }
            >
                모드 전환
            </button>
        </header>
    );
}
