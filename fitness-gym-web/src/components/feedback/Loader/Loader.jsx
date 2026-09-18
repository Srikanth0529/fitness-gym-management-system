import "./Loader.css";

function Loader({
    size = "medium",
    text,
    fullScreen = false,
}) {
    const loaderClasses = [
        "loader",
        `loader--${size}`,
        fullScreen ? "loader--fullscreen" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={loaderClasses}>
            <span className="loader__spinner" />

            {text && (
                <span className="loader__text">
                    {text}
                </span>
            )}
        </div>
    );
}

export default Loader;