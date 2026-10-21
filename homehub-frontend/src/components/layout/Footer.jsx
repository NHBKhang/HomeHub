import "./styles/Footer.css";

export default function Footer() {
    return (
        <footer className="app-footer">
            <p className="footer-copyright">
                © {new Date().getFullYear()} <span>HomeHub</span>. All rights
                reserved.
            </p>

            <p className="footer-tagline">
                Smart living, made simple.
            </p>
        </footer>
    );
}