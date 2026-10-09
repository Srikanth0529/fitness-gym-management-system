import {
    useEffect,
    useState,
} from "react";

import useAuth from "../../../hooks/useAuth";

import {
    getBookings,
    cancelBooking,
} from "../../../services/booking/bookingApi";

import ConfirmationDialog from "../../../components/feedback/ConfirmationDialog/ConfirmationDialog";

import "./Bookings.css";


const Bookings = () => {

    const { user } = useAuth();

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState({});

    const [cancelTarget, setCancelTarget] =
        useState(null);


    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getBookings();

            setBookings(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load bookings:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load your bookings."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        if (user) {
            loadBookings();
        }

    }, [user]);


    const handleCancelRequest = (
        booking
    ) => {

        if (
            booking.bookingStatus !==
            "CONFIRMED"
        ) {
            return;
        }

        setCancelTarget(
            booking
        );

        setError("");
        setSuccess("");
    };


    const handleConfirmCancel = async () => {

        if (!cancelTarget) {
            return;
        }

        const bookingId =
            cancelTarget.bookingId;

        try {

            setActionLoading(
                previous => ({
                    ...previous,
                    [bookingId]: true,
                })
            );

            setError("");
            setSuccess("");

            await cancelBooking(
                bookingId
            );

            setCancelTarget(
                null
            );

            setSuccess(
                "Booking cancelled successfully."
            );

            await loadBookings();

        } catch (err) {

            console.error(
                "Failed to cancel booking:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to cancel booking."
            );

        } finally {

            setActionLoading(
                previous => ({
                    ...previous,
                    [bookingId]: false,
                })
            );
        }
    };


    const formatDateTime = (
        value
    ) => {

        if (!value) {
            return "Not available";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    return (
        <section className="bookings-page">

            <div className="bookings-page__container">

                <header className="bookings-page__header">

                    <p className="bookings-page__eyebrow">
                        Member
                    </p>

                    <h1>
                        My Bookings
                    </h1>

                    <p>
                        View and manage your class bookings.
                    </p>

                </header>


                {error && (
                    <div className="bookings-page__message bookings-page__message--error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="bookings-page__message bookings-page__message--success">
                        {success}
                    </div>
                )}


                {loading ? (

                    <div className="bookings-page__empty">
                        Loading your bookings...
                    </div>

                ) : bookings.length === 0 ? (

                    <div className="bookings-page__empty">
                        You do not have any class bookings yet.
                    </div>

                ) : (

                    <div className="bookings-page__list">

                        {bookings.map(
                            booking => (

                                <article
                                    className="booking-card"
                                    key={
                                        booking.bookingId
                                    }
                                >

                                    <div className="booking-card__header">

                                        <div>

                                            <span>
                                                Fitness Class
                                            </span>

                                            <h2>
                                                {
                                                    booking.className ||
                                                    "Fitness Class"
                                                }
                                            </h2>

                                        </div>

                                        <span
                                            className={`booking-card__status booking-card__status--${String(
                                                booking.bookingStatus ||
                                                ""
                                            ).toLowerCase()}`}
                                        >
                                            {
                                                booking.bookingStatus ||
                                                "-"
                                            }
                                        </span>

                                    </div>


                                    <div className="booking-card__details">

                                        <div>
                                            <span>
                                                Booking ID
                                            </span>

                                            <strong>
                                                
                                                {
                                                    booking.bookingId
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Start
                                            </span>

                                            <strong>
                                                {
                                                    formatDateTime(
                                                        booking.startTime
                                                    )
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                End
                                            </span>

                                            <strong>
                                                {
                                                    formatDateTime(
                                                        booking.endTime
                                                    )
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    {booking.bookingStatus ===
                                        "CONFIRMED" && (

                                        <button
                                            type="button"
                                            className="booking-card__cancel"
                                            onClick={() =>
                                                handleCancelRequest(
                                                    booking
                                                )
                                            }
                                            disabled={
                                                actionLoading[
                                                    booking.bookingId
                                                ]
                                            }
                                        >
                                            {
                                                actionLoading[
                                                    booking.bookingId
                                                ]
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"
                                            }
                                        </button>

                                    )}

                                </article>

                            )
                        )}

                    </div>

                )}

            </div>


            <ConfirmationDialog
                open={
                    Boolean(
                        cancelTarget
                    )
                }
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking?"
                confirmText="Cancel Booking"
                cancelText="Keep Booking"
                onConfirm={
                    handleConfirmCancel
                }
                onCancel={() =>
                    setCancelTarget(
                        null
                    )
                }
                loading={
                    cancelTarget
                        ? Boolean(
                            actionLoading[
                                cancelTarget.bookingId
                            ]
                        )
                        : false
                }
            />

        </section>
    );
};


export default Bookings;