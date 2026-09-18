import { NavLink } from "react-router-dom";
import "./NavigationItem.css";

function NavigationItem({
    label,
    path,
    icon: Icon,
    onNavigate,
}) {
    return (
        <NavLink
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
                `navigation-item ${
                    isActive
                        ? "navigation-item--active"
                        : ""
                }`
            }
        >
            <span className="navigation-item__icon">
                <Icon
                    size={20}
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </span>

            <span className="navigation-item__label">
                {label}
            </span>
        </NavLink>
    );
}

export default NavigationItem;