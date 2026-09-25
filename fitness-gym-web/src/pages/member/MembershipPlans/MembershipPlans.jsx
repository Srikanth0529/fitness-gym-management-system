import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMembershipPlans } from "../../../services/member/membershipApi";
import "./MembershipPlans.css";

const MembershipPlans = () => {
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadMembershipPlans = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMembershipPlans();

                setPlans(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load membership plans:", err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load membership plans. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadMembershipPlans();
    }, []);

    const handleSubscribe = (planId) => {
        navigate(`/member/subscribe?planId=${planId}`);
    };

    if (loading) {
        return (
            <section className="membership-plans">
                <div className="membership-plans__container">
                    <div className="membership-plans__state">
                        <p className="membership-plans__state-text">
                            Loading membership plans...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="membership-plans">
                <div className="membership-plans__container">
                    <div className="membership-plans__state membership-plans__state--error">
                        <p className="membership-plans__state-text">
                            {error}
                        </p>

                        <button
                            type="button"
                            className="membership-plans__retry-button"
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
        <section className="membership-plans">
            <div className="membership-plans__container">
                <header className="membership-plans__header">
                    <div>
                        <p className="membership-plans__eyebrow">
                            Membership
                        </p>

                        <h1 className="membership-plans__title">
                            Membership Plans
                        </h1>

                        <p className="membership-plans__description">
                            Choose a membership plan that fits your fitness
                            journey.
                        </p>
                    </div>
                </header>

                {plans.length === 0 ? (
                    <div className="membership-plans__state">
                        <p className="membership-plans__state-text">
                            No active membership plans are currently available.
                        </p>
                    </div>
                ) : (
                    <div className="membership-plans__grid">
                        {plans.map((plan) => (
                            <article
                                className="membership-plan-card"
                                key={plan.planId}
                            >
                                <div className="membership-plan-card__header">
                                    <h2 className="membership-plan-card__name">
                                        {plan.planName}
                                    </h2>

                                    <span
                                        className={`membership-plan-card__status membership-plan-card__status--${String(
                                            plan.planStatus
                                        ).toLowerCase()}`}
                                    >
                                        {plan.planStatus}
                                    </span>
                                </div>

                                <p className="membership-plan-card__description">
                                    {plan.description ||
                                        "Membership plan details available."}
                                </p>

                                <div className="membership-plan-card__price">
                                    <span className="membership-plan-card__currency">
                                        ₹
                                    </span>

                                    <span className="membership-plan-card__amount">
                                        {plan.price}
                                    </span>
                                </div>

                                <p className="membership-plan-card__duration">
                                    Valid for {plan.durationDays} days
                                </p>

                                <div className="membership-plan-card__footer">
                                    <span className="membership-plan-card__label">
                                        Membership plan
                                    </span>

                                    <button
                                        type="button"
                                        className="membership-plan-card__subscribe-button"
                                        onClick={() =>
                                            handleSubscribe(plan.planId)
                                        }
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MembershipPlans;