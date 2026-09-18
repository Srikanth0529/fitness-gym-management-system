import "./Footer.css";

function Footer() {
    return (
        <footer className="app-footer">
            <div className="app-footer__content">
                <span>
                    © 2026 Fitness & Gym Management System
                </span>

                <div className="app-footer__links">
                    <button type="button">
                        Privacy
                    </button>

                    <button type="button">
                        Terms
                    </button>

                    <button type="button">
                        Help
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;