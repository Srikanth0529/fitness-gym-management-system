import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSubscription } from "../../../services/member/membershipApi";
import "./CurrentMembership.css";

const CurrentMembership = () => {
    const navigate = useNavigate();

    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCurrentMembership = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getCurrentSubscription();

                setSubscription(response?.data || null);
            } catch (err) {
                console.error(
                    "Failed to load current membership:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load your current membership."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCurrentMembership();
    }, []);

    if (loading) {
        return (
            <section className="current-membership">
                <div className="current-membership__container">
                    <div className="current-membership__state">
                        <p>
                            Loading your membership...
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="current-membership">
                <div className="current-membership__container">
                    <div className="current-membership__state current-membership__state--error">
                        <p>{error}</p>

                        <button
                            type="button"
                            className="current-membership__primary-button"
                            onClick={() =>
                                navigate(
                                    "/member/membership-plans"
                                )
                            }
                        >
                            View Membership Plans
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!subscription) {
        return (
            <section className="current-membership">
                <div className="current-membership__container">
                    <header className="current-membership__header">
                        <p className="current-membership__eyebrow">
                            Membership
                        </p>

                        <h1 className="current-membership__title">
                            Current Membership
                        </h1>
                    </header>

                    <div className="current-membership__state">
                        <p>
                            You do not have an active membership.
                        </p>

                        <button
                            type="button"
                            className="current-membership__primary-button"
                            onClick={() =>
                                navigate(
                                    "/member/membership-plans"
                                )
                            }
                        >
                            View Membership Plans
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="current-membership">
            <div className="current-membership__container">
                <header className="current-membership__header">
                    <div>
                        <p className="current-membership__eyebrow">
                            Membership
                        </p>

                        <h1 className="current-membership__title">
                            Current Membership
                        </h1>

                        <p className="current-membership__description">
                            View the details of your active membership.
                        </p>
                    </div>
                </header>

                <article className="current-membership__card">
                    <div className="current-membership__card-header">
                        <div>
                            <p className="current-membership__label">
                                Membership Plan
                            </p>

                            <h2 className="current-membership__plan-name">
                                {subscription.planName}
                            </h2>
                        </div>

                        <span className="current-membership__status">
                            {subscription.status}
                        </span>
                    </div>

                    <div className="current-membership__details">
                        <div className="current-membership__detail">
                            <span className="current-membership__detail-label">
                                Subscription ID
                            </span>

                            <strong>
                                #{subscription.subscriptionId}
                            </strong>
                        </div>

                        <div className="current-membership__detail">
                            <span className="current-membership__detail-label">
                                Plan ID
                            </span>

                            <strong>
                                #{subscription.planId}
                            </strong>
                        </div>

                        <div className="current-membership__detail">
                            <span className="current-membership__detail-label">
                                Start Date
                            </span>

                            <strong>
                                {subscription.startDate}
                            </strong>
                        </div>

                        <div className="current-membership__detail">
                            <span className="current-membership__detail-label">
                                End Date
                            </span>

                            <strong>
                                {subscription.endDate}
                            </strong>
                        </div>
                    </div>

                    <div className="current-membership__footer">
                        <button
                            type="button"
                            className="current-membership__secondary-button"
                            onClick={() =>
                                navigate(
                                    "/member/membership-plans"
                                )
                            }
                        >
                            View Plans
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
};

export default CurrentMembership;