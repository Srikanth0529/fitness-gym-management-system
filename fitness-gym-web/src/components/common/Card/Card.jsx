import "./Card.css";

function Card({
    children,
    title,
    subtitle,
    padding = "medium",
    className = "",
}) {
    const cardClasses = [
        "card",
        `card--padding-${padding}`,
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <section className={cardClasses}>
            {(title || subtitle) && (
                <header className="card__header">
                    {title && <h2 className="card__title">{title}</h2>}

                    {subtitle && (
                        <p className="card__subtitle">{subtitle}</p>
                    )}
                </header>
            )}

            <div className="card__content">
                {children}
            </div>
        </section>
    );
}

export default Card;