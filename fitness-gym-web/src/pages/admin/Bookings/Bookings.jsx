import {
    useEffect,
    useState,
} from "react";

import {
    getBookings,
    getBookingById,
    cancelBooking,
} from "../../../services/booking/bookingApi";

import ConfirmationDialog from "../../../components/feedback/ConfirmationDialog/ConfirmationDialog";
import useAuth from "../../../hooks/useAuth";

import "./Bookings.css";


const Bookings = () => {

    const { user } = useAuth();

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState({});

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [viewLoading, setViewLoading] =
        useState(false);

    const [cancelTarget, setCancelTarget] =
        useState(null);


    /*
     * =========================================================
     * LOAD BOOKINGS
     * =========================================================
     */

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
                "Unable to load bookings."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadBookings();

    }, []);


    /*
     * =========================================================
     * VIEW BOOKING
     * =========================================================
     */

    const handleView = async (
        bookingId
    ) => {

        try {

            setViewLoading(true);
            setError("");

            const booking =
                await getBookingById(
                    bookingId
                );

            setSelectedBooking(
                booking
            );

        } catch (err) {

            console.error(
                "Failed to load booking:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load booking details."
            );

        } finally {

            setViewLoading(false);
        }
    };


    /*
     * =========================================================
     * OPEN CANCEL CONFIRMATION
     * =========================================================
     */

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
    };


    /*
     * =========================================================
     * CONFIRM CANCEL
     * =========================================================
     */

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

            await cancelBooking(
                bookingId
            );

            setCancelTarget(
                null
            );

            setSelectedBooking(
                null
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


    /*
     * =========================================================
     * FORMAT DATE
     * =========================================================
     */

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
        <section className="admin-bookings">

            <div className="admin-bookings__container">

                <header className="admin-bookings__header">

                    <p>
                        {user?.role === "TRAINER"
                            ? "Trainer"
                            : "Administration"}
                    </p>

                    <h1>
                        Class Bookings
                    </h1>

                    <span>
                        {user?.role === "TRAINER"
                            ? "View and manage bookings for your classes."
                            : "Manage bookings across the gym."}
                    </span>

                </header>


                {error && (
                    <div className="admin-bookings__error">
                        {error}
                    </div>
                )}


                {loading ? (

                    <div className="admin-bookings__state">
                        Loading bookings...
                    </div>

                ) : bookings.length === 0 ? (

                    <div className="admin-bookings__state">
                        No class bookings found.
                    </div>

                ) : (

                    <div className="admin-bookings__table-wrapper">

                        <table className="admin-bookings__table">

                            <thead>

                                <tr>

                                    <th>
                                        Booking
                                    </th>

                                    <th>
                                        Member
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Class
                                    </th>

                                    <th>
                                        Start
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bookings.map(
                                    booking => (

                                        <tr
                                            key={
                                                booking.bookingId
                                            }
                                        >

                                            <td>
                                                
                                                {
                                                    booking.bookingId
                                                }
                                            </td>


                                            <td>
                                                <strong>
                                                    {
                                                        booking.memberName ||
                                                        `Member ${booking.memberId}`
                                                    }
                                                </strong>
                                            </td>


                                            <td>
                                                {
                                                    booking.memberPhone ||
                                                    "Not available"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    booking.className ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    formatDateTime(
                                                        booking.startTime
                                                    )
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`booking-status booking-status--${String(
                                                        booking.bookingStatus ||
                                                        ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {
                                                        booking.bookingStatus ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                <div className="admin-bookings__actions">

                                                    <button
                                                        type="button"
                                                        className="admin-bookings__view-button"
                                                        onClick={() =>
                                                            handleView(
                                                                booking.bookingId
                                                            )
                                                        }
                                                    >
                                                        {viewLoading
                                                            ? "..."
                                                            : "View"}
                                                    </button>


                                                    {booking.bookingStatus ===
                                                        "CONFIRMED" && (

                                                        <button
                                                            type="button"
                                                            className="admin-bookings__cancel-button"
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
                                                                    ? "..."
                                                                    : "Cancel"
                                                            }
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {selectedBooking && (

                    <div className="admin-bookings__details">

                        <div className="admin-bookings__details-header">

                            <div>
                                <span>
                                    Booking Details
                                </span>

                                <h2>
                                    
                                    {
                                        selectedBooking.bookingId
                                    }
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedBooking(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                        </div>


                        <div className="admin-bookings__details-grid">

                            <div>
                                <span>
                                    Member
                                </span>

                                <strong>
                                    {
                                        selectedBooking.memberName ||
                                        `Member ${selectedBooking.memberId}`
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {
                                        selectedBooking.memberPhone ||
                                        "Not available"
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Class
                                </span>

                                <strong>
                                    {
                                        selectedBooking.className ||
                                        "-"
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
                                            selectedBooking.startTime
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
                                            selectedBooking.endTime
                                        )
                                    }
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {
                                        selectedBooking.bookingStatus ||
                                        "-"
                                    }
                                </strong>
                            </div>

                        </div>

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