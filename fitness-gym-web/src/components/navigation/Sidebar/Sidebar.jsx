import { navigationConfig } from "../../../constants/navigation";

import NavigationItem from "../NavigationItem/NavigationItem";

import "./Sidebar.css";

function Sidebar({
    user,
    isOpen,
    isCollapsed,
    onClose,
}) {
    const role = user?.role;

    const navigationItems =
        navigationConfig[role] || [];

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    className="sidebar__overlay"
                    aria-label="Close navigation"
                    onClick={onClose}
                />
            )}

            <aside
                    className={`sidebar ${
                        isOpen
                            ? "sidebar--open"
                            : ""
                    } ${
                        isCollapsed
                            ? "sidebar--collapsed"
                            : ""
                    }`}
                >
                <div className="sidebar__header">
                    <div>
                        <span className="sidebar__role">
                            {role || "USER"}
                        </span>

                        <span className="sidebar__label">
                            Navigation
                        </span>
                    </div>

                    <button
                        type="button"
                        className="sidebar__close"
                        aria-label="Close navigation"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <nav
                    className="sidebar__navigation"
                    aria-label="Primary navigation"
                >
                    {navigationItems.map(
                        (item) => (
                            <NavigationItem
                                key={item.path}
                                {...item}
                                onNavigate={onClose}
                            />
                        )
                    )}
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;