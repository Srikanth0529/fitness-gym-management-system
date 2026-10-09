import {
    useEffect,
    useState,
} from "react";

import useAuth from "../../../hooks/useAuth";

import {
    getTrainerClients,
} from "../../../services/trainer/trainerApi";

import {
    getBookings,
} from "../../../services/booking/bookingApi";

import "./ClientBookings.css";

const ClientBookings = () => {

    const { user } = useAuth();

    const [clients, setClients] =
        useState([]);

    const [selectedClient, setSelectedClient] =
        useState("");

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [bookingsLoading, setBookingsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadClients = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTrainerClients(
                    user.trainerId
                );

            setClients(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load clients:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load clients."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        if (user?.trainerId) {
            loadClients();
        }

    }, [user?.trainerId]);

    const loadBookings = async (
        memberId
    ) => {

        try {

            setBookingsLoading(true);
            setError("");

            const data =
                await getBookings({
                    memberId,
                });

            setBookings(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load client bookings:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load client bookings."
            );

        } finally {

            setBookingsLoading(false);
        }
    };

    const handleClientChange = (
        event
    ) => {

        const memberId =
            event.target.value;

        setSelectedClient(
            memberId
        );

        if (memberId) {
            loadBookings(memberId);
        } else {
            setBookings([]);
        }
    };

    if (loading) {

        return (
            <section className="client-bookings">
                <div className="client-bookings__container">
                    Loading clients...
                </div>
            </section>
        );
    }

    return (
        <section className="client-bookings">

            <div className="client-bookings__container">

                <header className="client-bookings__header">

                    <p>
                        Trainer
                    </p>

                    <h1>
                        Client Bookings
                    </h1>

                    <span>
                        View class bookings for your assigned clients.
                    </span>

                </header>

                {error && (
                    <div className="client-bookings__error">
                        {error}
                    </div>
                )}

                <div className="client-bookings__selector">

                    <label htmlFor="client">
                        Select Client
                    </label>

                    <select
                        id="client"
                        value={selectedClient}
                        onChange={
                            handleClientChange
                        }
                    >

                        <option value="">
                            Select a client
                        </option>

                        {clients.map(
                            client => (

                                <option
                                    key={
                                        client.memberId
                                    }
                                    value={
                                        client.memberId
                                    }
                                >
                                    {
                                        client.firstName ||
                                        client.name ||
                                        `Member ${client.memberId}`
                                    }
                                </option>

                            )
                        )}

                    </select>

                </div>

                {selectedClient && (

                    <div className="client-bookings__results">

                        {bookingsLoading ? (

                            <div className="client-bookings__empty">
                                Loading bookings...
                            </div>

                        ) : bookings.length === 0 ? (

                            <div className="client-bookings__empty">
                                This client has no bookings.
                            </div>

                        ) : (

                            bookings.map(
                                booking => (

                                    <article
                                        className="client-booking-card"
                                        key={
                                            booking.bookingId
                                        }
                                    >

                                        <span>
                                            Booking 
                                            {
                                                booking.bookingId
                                            }
                                        </span>

                                        <h2>
                                            {
                                                booking.className ||
                                                "Fitness Class"
                                            }
                                        </h2>

                                        <p>
                                            {
                                                booking.startTime ||
                                                "Schedule unavailable"
                                            }
                                        </p>

                                        <strong>
                                            {
                                                booking.bookingStatus ||
                                                booking.status ||
                                                "ACTIVE"
                                            }
                                        </strong>

                                    </article>

                                )
                            )

                        )}

                    </div>

                )}

            </div>

        </section>
    );
};

export default ClientBookings;