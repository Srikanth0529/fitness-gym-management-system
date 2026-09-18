import { Inbox } from "lucide-react";

import "./EmptyState.css";

function EmptyState({
    title = "No data found",
    message,
    icon,
    action,
}) {
    return (
        <div className="empty-state">
            <div className="empty-state__icon">
                {icon || <Inbox size={32} />}
            </div>

            <h3 className="empty-state__title">
                {title}
            </h3>

            {message && (
                <p className="empty-state__message">
                    {message}
                </p>
            )}

            {action && (
                <div className="empty-state__action">
                    {action}
                </div>
            )}
        </div>
    );
}

export default EmptyState;