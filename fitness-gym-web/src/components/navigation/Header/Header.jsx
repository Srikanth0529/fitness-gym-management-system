import UserMenu from "../UserMenu/UserMenu";

import "./Header.css";

function Header({
    onMenuToggle,
}) {
    return (
        <header className="app-header">
            <div className="app-header__left">
                <button
                    type="button"
                    className="app-header__menu-button"
                    onClick={onMenuToggle}
                    aria-label="Open navigation"
                >
                    ☰
                </button>

                <div className="app-header__brand">
                    <span className="app-header__brand-name">
                        Fitness & Gym
                    </span>

                    <span className="app-header__brand-subtitle">
                        Management System
                    </span>
                </div>
            </div>

            <div className="app-header__right">
                <button
                    type="button"
                    className="app-header__notification"
                    aria-label="Notifications"
                >
                    🔔
                </button>

                <UserMenu />
            </div>
        </header>
    );
}

export default Header;