import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";

import "./UserMenu.css";

function UserMenu() {
    const [isOpen, setIsOpen] =
        useState(false);

    const menuRef = useRef(null);

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleProfile = () => {
        setIsOpen(false);

        if (user?.role === "MEMBER") {
            navigate("/member/profile");
            return;
        }

        if (user?.role === "ADMIN") {
            navigate("/admin/dashboard");
            return;
        }

        if (user?.role === "TRAINER") {
            navigate("/trainer/dashboard");
        }
    };

    const handleLogout = () => {
        setIsOpen(false);

        logout();

        navigate("/login", {
            replace: true,
        });
    };

    const displayName =
        user?.firstName ||
        user?.email ||
        "User";

    return (
        <div
            className="user-menu"
            ref={menuRef}
        >
            <button
                type="button"
                className="user-menu__trigger"
                onClick={() =>
                    setIsOpen(
                        (current) => !current
                    )
                }
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                <span className="user-menu__avatar">
                    {displayName
                        .charAt(0)
                        .toUpperCase()}
                </span>

                <span className="user-menu__info">
                    <span className="user-menu__name">
                        {displayName}
                    </span>

                    <span className="user-menu__role">
                        {user?.role || "USER"}
                    </span>
                </span>

                <span className="user-menu__arrow">
                    {isOpen ? "⌃" : "⌄"}
                </span>
            </button>

            {isOpen && (
                <div
                    className="user-menu__dropdown"
                    role="menu"
                >
                    <div className="user-menu__account">
                        <span className="user-menu__account-name">
                            {displayName}
                        </span>

                        <span className="user-menu__account-email">
                            {user?.email}
                        </span>
                    </div>

                    <div className="user-menu__divider" />

                    <button
                        type="button"
                        className="user-menu__item"
                        onClick={
                            handleProfile
                        }
                        role="menuitem"
                    >
                        <span>◉</span>
                        <span>
                            My Profile
                        </span>
                    </button>

                    <button
                        type="button"
                        className="user-menu__item"
                        onClick={() => {
                            setIsOpen(false);
                        }}
                        role="menuitem"
                    >
                        <span>⚙</span>
                        <span>
                            Settings
                        </span>
                    </button>

                    <div className="user-menu__divider" />

                    <button
                        type="button"
                        className="user-menu__item user-menu__item--logout"
                        onClick={
                            handleLogout
                        }
                        role="menuitem"
                    >
                        <span>↪</span>
                        <span>
                            Logout
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;