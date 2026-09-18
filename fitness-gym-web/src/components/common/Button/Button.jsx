import "./Button.css";

function Button({
    children,
    type = "button",
    variant = "primary",
    size = "medium",
    disabled = false,
    loading = false,
    fullWidth = false,
    onClick,
    className = "",
}) {
    const buttonClasses = [
        "button",
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? "button--full-width" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
        >
            {loading ? (
                <span className="button__loading">
                    <span className="button__spinner" />
                    <span>Loading...</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}

export default Button;