import {
    useEffect,
    useState,
} from "react";

import {
    getClasses,
    getClassOccurrences,
} from "../../../services/member/classApi";

import {
    bookClass,
    cancelBooking,
    getBookings,
} from "../../../services/booking/bookingApi";

import ConfirmationDialog from "../../../components/feedback/ConfirmationDialog/ConfirmationDialog";

import useAuth from "../../../hooks/useAuth";

import "./Classes.css";


const Classes = () => {

    const { user } = useAuth();

    const [classes, setClasses] =
        useState([]);

    const [occurrences, setOccurrences] =
        useState({});

    const [bookings, setBookings] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [loadingOccurrences, setLoadingOccurrences] =
        useState({});

    const [bookingLoading, setBookingLoading] =
        useState({});

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [cancelTarget, setCancelTarget] =
        useState(null);


    const memberId =
        user?.memberId;


    /*
     * =========================================================
     * LOAD CLASSES
     * =========================================================
     */

    useEffect(() => {

        const loadClasses = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getClasses();

                setClasses(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load classes:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load classes."
                );

            } finally {

                setLoading(false);
            }
        };

        loadClasses();

    }, []);


    /*
     * =========================================================
     * LOAD EXISTING MEMBER BOOKINGS
     * =========================================================
     */

    useEffect(() => {

        const loadBookings = async () => {

            if (!memberId) {
                return;
            }

            try {

                const data =
                    await getBookings();

                const bookingMap = {};

                if (Array.isArray(data)) {

                    data.forEach(
                        booking => {

                            if (
                                booking.bookingStatus ===
                                "CONFIRMED"
                            ) {

                                bookingMap[
                                    booking.occurrenceId
                                ] = booking;

                            }

                        }
                    );
                }

                setBookings(
                    bookingMap
                );

            } catch (err) {

                console.error(
                    "Failed to load bookings:",
                    err
                );
            }
        };

        loadBookings();

    }, [memberId]);


    /*
     * =========================================================
     * LOAD OCCURRENCES
     * =========================================================
     */

    const loadOccurrences = async (
        classId
    ) => {

        try {

            setLoadingOccurrences(
                previous => ({
                    ...previous,
                    [classId]: true,
                })
            );

            setError("");

            const data =
                await getClassOccurrences(
                    classId
                );

            setOccurrences(
                previous => ({
                    ...previous,
                    [classId]:
                        Array.isArray(data)
                            ? data
                            : [],
                })
            );

        } catch (err) {

            console.error(
                "Failed to load schedule:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load class schedule."
            );

        } finally {

            setLoadingOccurrences(
                previous => ({
                    ...previous,
                    [classId]: false,
                })
            );
        }
    };


    /*
     * =========================================================
     * BOOK CLASS
     * =========================================================
     */

    const handleBook = async (
        occurrence
    ) => {

        if (!memberId) {

            setError(
                "Member information is not available."
            );

            return;
        }

        try {

            setBookingLoading(
                previous => ({
                    ...previous,
                    [occurrence.occurrenceId]: true,
                })
            );

            setError("");
            setSuccess("");

            const response =
                await bookClass(
                    memberId,
                    occurrence.occurrenceId
                );

            const booking =
                response?.data;

            setBookings(
                previous => ({
                    ...previous,
                    [occurrence.occurrenceId]:
                        booking,
                })
            );

            setOccurrences(
                previous => ({
                    ...previous,
                    [occurrence.classId]:
                        (
                            previous[
                                occurrence.classId
                            ] || []
                        ).map(
                            item =>
                                item.occurrenceId ===
                                occurrence.occurrenceId
                                    ? {
                                        ...item,
                                        currentBookings:
                                            (
                                                item.currentBookings ||
                                                0
                                            ) + 1,
                                    }
                                    : item
                        ),
                })
            );

            setSuccess(
                "Class booked successfully."
            );

        } catch (err) {

            console.error(
                "Failed to book class:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to book the class."
            );

        } finally {

            setBookingLoading(
                previous => ({
                    ...previous,
                    [occurrence.occurrenceId]:
                        false,
                })
            );
        }
    };


    /*
     * =========================================================
     * REQUEST CANCEL
     * =========================================================
     */

    const handleCancelRequest = (
        occurrence
    ) => {

        const booking =
            bookings[
                occurrence.occurrenceId
            ];

        if (!booking) {
            return;
        }

        setCancelTarget({
            occurrence,
            booking,
        });

        setError("");
        setSuccess("");
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

        const {
            occurrence,
            booking,
        } = cancelTarget;

        try {

            setBookingLoading(
                previous => ({
                    ...previous,
                    [occurrence.occurrenceId]:
                        true,
                })
            );

            setError("");
            setSuccess("");

            await cancelBooking(
                booking.bookingId
            );

            setBookings(
                previous => {

                    const updated = {
                        ...previous,
                    };

                    delete updated[
                        occurrence.occurrenceId
                    ];

                    return updated;
                }
            );

            setOccurrences(
                previous => ({
                    ...previous,
                    [occurrence.classId]:
                        (
                            previous[
                                occurrence.classId
                            ] || []
                        ).map(
                            item =>
                                item.occurrenceId ===
                                occurrence.occurrenceId
                                    ? {
                                        ...item,
                                        currentBookings:
                                            Math.max(
                                                0,
                                                (
                                                    item.currentBookings ||
                                                    0
                                                ) - 1
                                            ),
                                    }
                                    : item
                        ),
                })
            );

            setCancelTarget(
                null
            );

            setSuccess(
                "Booking cancelled successfully."
            );

        } catch (err) {

            console.error(
                "Failed to cancel booking:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to cancel the booking."
            );

        } finally {

            setBookingLoading(
                previous => ({
                    ...previous,
                    [occurrence.occurrenceId]:
                        false,
                })
            );
        }
    };


    const formatDateTime = (
        value
    ) => {

        if (!value) {
            return "Not scheduled";
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


    if (loading) {

        return (
            <section className="classes">

                <div className="classes__container">

                    <div className="classes__state">
                        Loading classes...
                    </div>

                </div>

            </section>
        );
    }


    return (
        <section className="classes">

            <div className="classes__container">

                <header className="classes__header">

                    <p className="classes__eyebrow">
                        Fitness
                    </p>

                    <h1 className="classes__title">
                        Classes
                    </h1>

                    <p className="classes__description">
                        Explore available fitness classes,
                        schedules and bookings.
                    </p>

                </header>


                {error && (
                    <div className="classes__message classes__message--error">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="classes__message classes__message--success">
                        {success}
                    </div>
                )}


                {classes.length === 0 ? (

                    <div className="classes__state">
                        No classes are currently available.
                    </div>

                ) : (

                    <div className="classes__grid">

                        {classes.map(
                            gymClass => {

                                const classOccurrences =
                                    occurrences[
                                        gymClass.classId
                                    ];

                                const hasOccurrences =
                                    Array.isArray(
                                        classOccurrences
                                    );

                                return (

                                    <article
                                        className="class-card"
                                        key={
                                            gymClass.classId
                                        }
                                    >

                                        <div className="class-card__header">

                                            <div>

                                                <p className="class-card__label">
                                                    Fitness Class
                                                </p>

                                                <h2 className="class-card__name">
                                                    {
                                                        gymClass.className
                                                    }
                                                </h2>

                                            </div>

                                            <span
                                                className={`class-card__status class-card__status--${String(
                                                    gymClass.classStatus
                                                ).toLowerCase()}`}
                                            >
                                                {
                                                    gymClass.classStatus
                                                }
                                            </span>

                                        </div>


                                        <p className="class-card__description">
                                            {
                                                gymClass.description ||
                                                "No description available."
                                            }
                                        </p>


                                        <div className="class-card__details">

                                            <div>
                                                <span>
                                                    Trainer
                                                </span>

                                                <strong>
                                                    
                                                    {
                                                        gymClass.trainerId
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Capacity
                                                </span>

                                                <strong>
                                                    {
                                                        gymClass.defaultCapacity
                                                    }
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {
                                                        gymClass.location ||
                                                        "Not specified"
                                                    }
                                                </strong>
                                            </div>

                                        </div>


                                        <button
                                            type="button"
                                            className="classes__schedule-button"
                                            onClick={() =>
                                                loadOccurrences(
                                                    gymClass.classId
                                                )
                                            }
                                            disabled={
                                                loadingOccurrences[
                                                    gymClass.classId
                                                ]
                                            }
                                        >
                                            {
                                                loadingOccurrences[
                                                    gymClass.classId
                                                ]
                                                    ? "Loading Schedule..."
                                                    : hasOccurrences
                                                        ? "Refresh Schedule"
                                                        : "View Schedule"
                                            }
                                        </button>


                                        {hasOccurrences && (

                                            <div className="class-card__occurrences">

                                                <h3>
                                                    Scheduled Occurrences
                                                </h3>


                                                {classOccurrences.length ===
                                                0 ? (

                                                    <p>
                                                        No scheduled occurrences.
                                                    </p>

                                                ) : (

                                                    classOccurrences.map(
                                                        occurrence => {

                                                            const booking =
                                                                bookings[
                                                                    occurrence.occurrenceId
                                                                ];

                                                            const isBooked =
                                                                Boolean(
                                                                    booking
                                                                );

                                                            const isFull =
                                                                occurrence.currentBookings >=
                                                                occurrence.capacity;

                                                            const isActive =
                                                                String(
                                                                    occurrence.occurrenceStatus
                                                                ).toUpperCase() ===
                                                                "ACTIVE";

                                                            return (

                                                                <div
                                                                    className="occurrence-card"
                                                                    key={
                                                                        occurrence.occurrenceId
                                                                    }
                                                                >

                                                                    <div className="occurrence-card__top">

                                                                        <div>

                                                                            <strong>
                                                                                {
                                                                                    formatDateTime(
                                                                                        occurrence.startTime
                                                                                    )
                                                                                }
                                                                            </strong>

                                                                            <span>
                                                                                Ends{" "}
                                                                                {
                                                                                    formatDateTime(
                                                                                        occurrence.endTime
                                                                                    )
                                                                                }
                                                                            </span>

                                                                        </div>

                                                                        <span
                                                                            className={`occurrence-card__status occurrence-card__status--${String(
                                                                                occurrence.occurrenceStatus
                                                                            ).toLowerCase()}`}
                                                                        >
                                                                            {
                                                                                occurrence.occurrenceStatus
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                    <div className="occurrence-card__meta">

                                                                        <span>
                                                                            Seats
                                                                            {" "}
                                                                            {
                                                                                occurrence.currentBookings
                                                                            }
                                                                            /
                                                                            {
                                                                                occurrence.capacity
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                    {isBooked ? (

                                                                        <button
                                                                            type="button"
                                                                            className="occurrence-card__button occurrence-card__button--cancel"
                                                                            onClick={() =>
                                                                                handleCancelRequest(
                                                                                    occurrence
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                bookingLoading[
                                                                                    occurrence.occurrenceId
                                                                                ]
                                                                            }
                                                                        >
                                                                            {
                                                                                bookingLoading[
                                                                                    occurrence.occurrenceId
                                                                                ]
                                                                                    ? "Processing..."
                                                                                    : "Cancel Booking"
                                                                            }
                                                                        </button>

                                                                    ) : (

                                                                        <button
                                                                            type="button"
                                                                            className="occurrence-card__button"
                                                                            onClick={() =>
                                                                                handleBook(
                                                                                    occurrence
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                bookingLoading[
                                                                                    occurrence.occurrenceId
                                                                                ] ||
                                                                                !isActive ||
                                                                                isFull
                                                                            }
                                                                        >
                                                                            {
                                                                                bookingLoading[
                                                                                    occurrence.occurrenceId
                                                                                ]
                                                                                    ? "Booking..."
                                                                                    : isFull
                                                                                        ? "Class Full"
                                                                                        : !isActive
                                                                                            ? "Unavailable"
                                                                                            : "Book Class"
                                                                            }
                                                                        </button>

                                                                    )}

                                                                </div>

                                                            );
                                                        }
                                                    )

                                                )}

                                            </div>

                                        )}

                                    </article>

                                );
                            }
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
                            bookingLoading[
                                cancelTarget.occurrence?.occurrenceId
                            ]
                        )
                        : false
                }
            />

        </section>
    );
};


export default Classes;