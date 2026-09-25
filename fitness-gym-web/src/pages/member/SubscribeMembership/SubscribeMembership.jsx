import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    createSubscription,
    getMembershipPlans
} from "../../../services/member/membershipApi";
import "./SubscribeMembership.css";

const SubscribeMembership = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const planId = searchParams.get("planId");

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadPlan = async () => {
            if (!planId) {
                setError("Membership plan was not selected.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const plans = await getMembershipPlans();

                const selectedPlan = plans.find(
                    (item) => String(item.planId) === String(planId)
                );

                if (!selectedPlan) {
                    setError("Selected membership plan was not found.");
                    return;
                }

                setPlan(selectedPlan);
            } catch (err) {
                console.error("Failed to load membership plan:", err);

                setError(
                    err?.response?.data?.message ||
                    "Unable to load the selected membership plan."
                );
            } finally {
                setLoading(false);
            }
        };

        loadPlan();
    }, [planId]);

    const handleSubscribe = async () => {
        if (!planId) {
            return;
        }

        try {
            setSubscribing(true);
            setError("");
            setSuccess("");

            await createSubscription(Number(planId));

            setSuccess("Membership subscribed successfully.");

            setTimeout(() => {
                navigate("/member/membership");
            }, 700);
        } catch (err) {
            console.error("Membership subscription failed:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to subscribe to this membership plan."
            );
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) {
        return (
            <section className="subscribe-membership">
                <div className="subscribe-membership__container">
                    <div className="subscribe-membership__state">
                        <p>Loading membership plan...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error && !plan) {
        return (
            <section className="subscribe-membership">
                <div className="subscribe-membership__container">
                    <div className="subscribe-membership__state subscribe-membership__state--error">
                        <p>{error}</p>

                        <button
                            type="button"
                            className="subscribe-membership__secondary-button"
                            onClick={() =>
                                navigate("/member/membership-plans")
                            }
                        >
                            Back to Membership Plans
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="subscribe-membership">
            <div className="subscribe-membership__container">
                <header className="subscribe-membership__header">
                    <p className="subscribe-membership__eyebrow">
                        Membership
                    </p>

                    <h1 className="subscribe-membership__title">
                        Subscribe to Membership
                    </h1>

                    <p className="subscribe-membership__description">
                        Review your selected plan before subscribing.
                    </p>
                </header>

                {error && (
                    <div className="subscribe-membership__message subscribe-membership__message--error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="subscribe-membership__message subscribe-membership__message--success">
                        {success}
                    </div>
                )}

                {plan && (
                    <article className="subscribe-membership__card">
                        <div className="subscribe-membership__card-header">
                            <div>
                                <p className="subscribe-membership__label">
                                    Selected Plan
                                </p>

                                <h2 className="subscribe-membership__plan-name">
                                    {plan.planName}
                                </h2>
                            </div>

                            <span className="subscribe-membership__status">
                                {plan.planStatus}
                            </span>
                        </div>

                        <p className="subscribe-membership__plan-description">
                            {plan.description ||
                                "Membership plan details available."}
                        </p>

                        <div className="subscribe-membership__details">
                            <div className="subscribe-membership__detail">
                                <span className="subscribe-membership__detail-label">
                                    Price
                                </span>

                                <strong>
                                    ₹{plan.price}
                                </strong>
                            </div>

                            <div className="subscribe-membership__detail">
                                <span className="subscribe-membership__detail-label">
                                    Duration
                                </span>

                                <strong>
                                    {plan.durationDays} days
                                </strong>
                            </div>
                        </div>

                        <div className="subscribe-membership__actions">
                            <button
                                type="button"
                                className="subscribe-membership__secondary-button"
                                disabled={subscribing}
                                onClick={() =>
                                    navigate("/member/membership-plans")
                                }
                            >
                                Back
                            </button>

                            <button
                                type="button"
                                className="subscribe-membership__primary-button"
                                disabled={subscribing}
                                onClick={handleSubscribe}
                            >
                                {subscribing
                                    ? "Subscribing..."
                                    : "Confirm Subscription"}
                            </button>
                        </div>
                    </article>
                )}
            </div>
        </section>
    );
};

export default SubscribeMembership;