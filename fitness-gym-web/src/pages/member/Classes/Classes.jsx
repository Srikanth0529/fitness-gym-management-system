import { useEffect, useState } from "react";
import { getClasses } from "../../../services/member/classApi";
import "./Classes.css";

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadClasses = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getClasses();

                setClasses(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load classes:", err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load classes. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadClasses();
    }, []);

    if (loading) {
        return (
            <section className="classes">
                <div className="classes__container">
                    <div className="classes__state">
                        <p>Loading classes...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="classes">
                <div className="classes__container">
                    <div className="classes__state classes__state--error">
                        <p>{error}</p>

                        <button
                            type="button"
                            className="classes__retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="classes">
            <div className="classes__container">
                <header className="classes__header">
                    <div>
                        <p className="classes__eyebrow">
                            Fitness
                        </p>

                        <h1 className="classes__title">
                            Classes
                        </h1>

                        <p className="classes__description">
                            Explore the fitness classes currently
                            available at the gym.
                        </p>
                    </div>
                </header>

                {classes.length === 0 ? (
                    <div className="classes__state">
                        <p>
                            No classes are currently available.
                        </p>
                    </div>
                ) : (
                    <div className="classes__grid">
                        {classes.map((gymClass) => (
                            <article
                                className="class-card"
                                key={gymClass.classId}
                            >
                                <div className="class-card__header">
                                    <div>
                                        <p className="class-card__label">
                                            Fitness Class
                                        </p>

                                        <h2 className="class-card__name">
                                            {gymClass.className}
                                        </h2>
                                    </div>

                                    <span
                                        className={`class-card__status class-card__status--${String(
                                            gymClass.classStatus
                                        ).toLowerCase()}`}
                                    >
                                        {gymClass.classStatus}
                                    </span>
                                </div>

                                <p className="class-card__description">
                                    {gymClass.description ||
                                        "No description available."}
                                </p>

                                <div className="class-card__details">
                                    <div className="class-card__detail">
                                        <span className="class-card__detail-label">
                                            Trainer
                                        </span>

                                        <strong>
                                            #{gymClass.trainerId}
                                        </strong>
                                    </div>

                                    <div className="class-card__detail">
                                        <span className="class-card__detail-label">
                                            Capacity
                                        </span>

                                        <strong>
                                            {gymClass.defaultCapacity}
                                        </strong>
                                    </div>

                                    <div className="class-card__detail">
                                        <span className="class-card__detail-label">
                                            Location
                                        </span>

                                        <strong>
                                            {gymClass.location ||
                                                "Not specified"}
                                        </strong>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Classes;