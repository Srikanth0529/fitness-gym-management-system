import "./Container.css";

function Container({
    children,
    size = "large",
    className = "",
}) {
    const containerClasses = [
        "container",
        `container--${size}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClasses}>
            {children}
        </div>
    );
}

export default Container;