import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

import Button from "../../common/Button/Button";
import "./ConfirmationDialog.css";

const ConfirmationDialog = ({
    open,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
}) => {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !loading) {
                onCancel();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open, loading, onCancel]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="confirmation-dialog__overlay"
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !loading
                ) {
                    onCancel();
                }
            }}
        >
            <div
                className="confirmation-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-message"
            >
                <div className="confirmation-dialog__header">
                    <div className="confirmation-dialog__icon">
                        <AlertTriangle size={24} />
                    </div>

                    <button
                        type="button"
                        className="confirmation-dialog__close"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Close confirmation dialog"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="confirmation-dialog__content">
                    <h2
                        id="confirmation-dialog-title"
                        className="confirmation-dialog__title"
                    >
                        {title}
                    </h2>

                    <p
                        id="confirmation-dialog-message"
                        className="confirmation-dialog__message"
                    >
                        {message}
                    </p>
                </div>

                <div className="confirmation-dialog__actions">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;