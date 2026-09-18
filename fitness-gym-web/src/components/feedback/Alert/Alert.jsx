import {
    AlertCircle,
    CheckCircle2,
    Info,
    TriangleAlert,
} from "lucide-react";

import "./Alert.css";

const alertIcons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: TriangleAlert,
    info: Info,
};

function Alert({
    type = "info",
    title,
    message,
    children,
    onClose,
}) {
    const Icon = alertIcons[type] || Info;

    return (
        <div
            className={`alert alert--${type}`}
            role={type === "error" ? "alert" : "status"}
        >
            <Icon
                size={20}
                className="alert__icon"
            />

            <div className="alert__content">
                {title && (
                    <strong className="alert__title">
                        {title}
                    </strong>
                )}

                <div className="alert__message">
                    {message || children}
                </div>
            </div>

            {onClose && (
                <button
                    type="button"
                    className="alert__close"
                    onClick={onClose}
                    aria-label="Close alert"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default Alert;