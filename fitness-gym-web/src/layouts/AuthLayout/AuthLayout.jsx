import { Outlet } from "react-router-dom";

import "./AuthLayout.css";

function AuthLayout() {
    return (
        <div className="auth-layout">
            <div className="auth-layout__content">
                <div className="auth-layout__brand">
                    <h1>Fitness & Gym</h1>

                    <p>
                        Management System
                    </p>
                </div>

                <div className="auth-layout__form">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;