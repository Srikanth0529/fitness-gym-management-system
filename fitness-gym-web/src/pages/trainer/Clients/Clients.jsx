
import { useEffect, useMemo, useState } from "react";
import ConfirmationDialog from "../../../components/feedback/ConfirmationDialog/ConfirmationDialog";
import useAuth from "../../../hooks/useAuth";
import { cancelBooking } from "../../../services/booking/bookingApi";
import {
    getTrainerClients,
    getTrainerClassBookings,
} from "../../../services/trainer/trainerApi";
import "./Clients.css";

const getMemberId = (client) =>
    client?.memberId ??
    client?.member?.memberId ??
    client?.member?.id ??
    client?.id ??
    null;

const getBookingId = (booking) =>
    booking?.bookingId ?? booking?.id ?? null;

const getFullName = (record) => {
    const firstName =
        record?.firstName ??
        record?.member?.firstName ??
        record?.user?.firstName;

    const lastName =
        record?.lastName ??
        record?.member?.lastName ??
        record?.user?.lastName;

    return (
        [firstName, lastName].filter(Boolean).join(" ").trim() ||
        record?.memberName ||
        record?.member?.name ||
        record?.name ||
        (getMemberId(record) != null
            ? `Member ${getMemberId(record)}`
            : "Unnamed Member")
    );
};

const getEmail = (record) =>
    record?.email ||
    record?.memberEmail ||
    record?.userEmail ||
    record?.contactEmail ||
    record?.member?.email ||
    record?.member?.memberEmail ||
    record?.member?.user?.email ||
    record?.member?.userEmail ||
    record?.user?.email ||
    record?.user?.userEmail ||
    "-";

const getPhone = (record) =>
    record?.phone ||
    record?.memberPhone ||
    record?.member?.phone ||
    record?.member?.user?.phone ||
    record?.user?.phone ||
    "-";

const getStatus = (booking) =>
    String(booking?.bookingStatus || booking?.status || "").toUpperCase();

const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

const normalizeBooking = (booking) => ({
    ...booking,
    bookingId: getBookingId(booking),
    memberId:
        booking?.memberId ??
        booking?.member?.memberId ??
        booking?.member?.id ??
        null,
    memberName:
        booking?.memberName || getFullName(booking),
    memberEmail:
        booking?.memberEmail ||
        booking?.member?.email ||
        booking?.member?.memberEmail ||
        booking?.member?.user?.email ||
        booking?.member?.userEmail ||
        booking?.user?.email ||
        booking?.user?.userEmail ||
        booking?.email ||
        null,
    memberPhone:
        booking?.memberPhone ||
        booking?.member?.phone ||
        booking?.member?.user?.phone ||
        booking?.user?.phone ||
        booking?.phone ||
        null,
    className:
        booking?.className ||
        booking?.gymClassName ||
        booking?.class?.className ||
        booking?.class?.name ||
        "Class",
    startTime:
        booking?.startTime ||
        booking?.occurrenceStartTime ||
        booking?.classStartTime ||
        booking?.classOccurrence?.startTime ||
        null,
    endTime:
        booking?.endTime ||
        booking?.occurrenceEndTime ||
        booking?.classEndTime ||
        booking?.classOccurrence?.endTime ||
        null,
    bookingStatus: getStatus(booking),
});

const Clients = () => {
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [trainerBookings, setTrainerBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadClients = async () => {
        const trainerId = user?.trainerId;

        if (
            trainerId === null ||
            trainerId === undefined ||
            trainerId === ""
        ) {
            setError("Trainer information is unavailable.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const [clientData, bookingData] = await Promise.all([
                getTrainerClients(trainerId),
                getTrainerClassBookings(trainerId),
            ]);

            const assignmentList = Array.isArray(clientData)
                ? clientData
                : [];

            const bookingList = Array.isArray(bookingData)
                ? bookingData.map(normalizeBooking)
                : [];

            const assignmentMap = new Map();

            assignmentList.forEach((client) => {
                const memberId = getMemberId(client);
                if (memberId == null) return;

                const rawBookings =
                    client?.classBookings ||
                    client?.bookings ||
                    client?.classBookingList ||
                    [];

                assignmentMap.set(String(memberId), {
                    ...client,
                    memberId,
                    bookings: Array.isArray(rawBookings)
                        ? rawBookings.map(normalizeBooking)
                        : [],
                });
            });

            bookingList.forEach((booking) => {
                const memberId = booking.memberId;
                if (memberId == null) return;

                const key = String(memberId);
                const existing = assignmentMap.get(key);

                if (existing) {
                    const existingEmail = getEmail(existing);
                    const bookingEmail = booking.memberEmail || getEmail(booking);

                    assignmentMap.set(key, {
                        ...existing,
                        email:
                            existingEmail !== "-"
                                ? existingEmail
                                : bookingEmail !== "-"
                                    ? bookingEmail
                                    : null,
                        memberEmail:
                            existing.memberEmail ||
                            booking.memberEmail ||
                            null,
                        userEmail:
                            existing.userEmail ||
                            booking?.member?.user?.email ||
                            booking?.user?.email ||
                            null,
                        phone:
                            existing.phone ||
                            existing.memberPhone ||
                            booking.memberPhone ||
                            null,
                        memberPhone:
                            existing.memberPhone ||
                            booking.memberPhone ||
                            null,
                        firstName:
                            existing.firstName ||
                            booking?.member?.firstName ||
                            null,
                        lastName:
                            existing.lastName ||
                            booking?.member?.lastName ||
                            null,
                    });

                    const updated = assignmentMap.get(key);

                    const ids = new Set(
                        updated.bookings
                            .map(getBookingId)
                            .filter((id) => id != null)
                            .map(String)
                    );

                    if (
                        booking.bookingId != null &&
                        !ids.has(String(booking.bookingId))
                    ) {
                        updated.bookings.push(booking);
                    }
                } else {
                    assignmentMap.set(key, {
                        ...booking.member,
                        memberId,
                        firstName:
                            booking?.member?.firstName ??
                            booking?.firstName ??
                            null,
                        lastName:
                            booking?.member?.lastName ??
                            booking?.lastName ??
                            null,
                        memberName:
                            booking.memberName || getFullName(booking),
                        email:
                            booking.memberEmail ||
                            getEmail(booking) !== "-"
                                ? booking.memberEmail || getEmail(booking)
                                : null,
                        memberEmail: booking.memberEmail || null,
                        userEmail:
                            booking?.member?.user?.email ||
                            booking?.user?.email ||
                            null,
                        phone: booking.memberPhone || null,
                        memberPhone: booking.memberPhone || null,
                        bookings: [booking],
                    });
                }
            });

            const mergedClients = Array.from(
                assignmentMap.values()
            ).sort((a, b) =>
                getFullName(a).localeCompare(getFullName(b))
            );

            setClients(mergedClients);
            setTrainerBookings(bookingList);
        } catch (err) {
            console.error("Failed to load trainer clients:", err);
            setError(
                getErrorMessage(err, "Unable to load your clients.")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, [user?.trainerId]);

    const visibleClients = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return clients;

        return clients.filter((client) =>
            [
                getMemberId(client),
                client?.userId,
                getFullName(client),
                getEmail(client),
                getPhone(client),
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            )
        );
    }, [clients, search]);

    const getClientBookings = (client) => {
        const memberId = getMemberId(client);

        const embedded = Array.isArray(client?.bookings)
            ? client.bookings.map(normalizeBooking)
            : [];

        const global = trainerBookings.filter(
            (booking) =>
                String(booking?.memberId) === String(memberId)
        );

        const bookingMap = new Map();

        [...embedded, ...global].forEach((booking) => {
            const bookingId = getBookingId(booking);

            if (bookingId != null) {
                bookingMap.set(
                    String(bookingId),
                    normalizeBooking(booking)
                );
            }
        });

        return Array.from(bookingMap.values()).sort((a, b) => {
            const first = a?.startTime
                ? new Date(a.startTime).getTime()
                : 0;
            const second = b?.startTime
                ? new Date(b.startTime).getTime()
                : 0;

            return second - first;
        });
    };

    const formatDateTime = (value) => {
        if (!value) return "Not available";

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const confirmCancel = async () => {
        const bookingId = getBookingId(cancelTarget);

        if (
            bookingId === null ||
            bookingId === undefined ||
            bookingId === ""
        ) {
            setError("Booking ID is unavailable.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            setSuccess("");

            await cancelBooking(bookingId);

            setCancelTarget(null);
            setSelectedClient(null);
            setSuccess("Class booking cancelled successfully.");

            await loadClients();
        } catch (err) {
            console.error(
                "Failed to cancel trainer client booking:",
                err
            );
            setError(
                getErrorMessage(
                    err,
                    "Unable to cancel class booking."
                )
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="trainer-clients">
                <div className="trainer-clients__container">
                    Loading clients...
                </div>
            </section>
        );
    }

    return (
        <section className="trainer-clients">
            <div className="trainer-clients__container">
                <header className="trainer-clients__header">
                    <div>
                        <p>Trainer</p>
                        <h1>My Clients</h1>
                        <span>
                            Members who have class bookings with you.
                        </span>
                    </div>

                    <div className="trainer-clients__count">
                        <strong>{clients.length}</strong>
                        <span>Assigned Clients</span>
                    </div>
                </header>

                {error && (
                    <div className="trainer-clients__message trainer-clients__message--error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="trainer-clients__message trainer-clients__message--success">
                        {success}
                    </div>
                )}

                <div className="trainer-clients__toolbar">
                    <input
                        className="trainer-clients__search"
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by member ID, name, email or phone"
                    />

                    <button
                        type="button"
                        className="trainer-clients__refresh"
                        onClick={loadClients}
                        disabled={loading || actionLoading}
                    >
                        Refresh
                    </button>
                </div>

                {visibleClients.length === 0 ? (
                    <div className="trainer-clients__empty">
                        {search.trim()
                            ? "No assigned clients match your search."
                            : "No clients are currently assigned to you."}
                    </div>
                ) : (
                    <div className="trainer-clients__table-wrapper">
                        <table className="trainer-clients__table">
                            <thead>
                                <tr>
                                    <th>Member ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Total Bookings</th>
                                    <th>Confirmed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleClients.map((client, index) => {
                                    const memberId = getMemberId(client);
                                    const bookings =
                                        getClientBookings(client);
                                    const confirmedCount =
                                        bookings.filter(
                                            (booking) =>
                                                getStatus(booking) ===
                                                "CONFIRMED"
                                        ).length;

                                    return (
                                        <tr
                                            key={
                                                memberId ??
                                                `client-${index}`
                                            }
                                        >
                                            <td>{memberId ?? "-"}</td>
                                            <td className="trainer-clients__name">
                                                {getFullName(client)}
                                            </td>
                                            <td>{getEmail(client)}</td>
                                            <td>{getPhone(client)}</td>
                                            <td>{bookings.length}</td>
                                            <td>{confirmedCount}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="trainer-clients__view-button"
                                                    onClick={() => {
                                                        setError("");
                                                        setSuccess("");
                                                        setSelectedClient(
                                                            client
                                                        );
                                                    }}
                                                >
                                                    View Bookings
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedClient && (
                    <section className="trainer-clients__details">
                        <div className="trainer-clients__details-header">
                            <div>
                                <span>Assigned Client</span>
                                <h2>
                                    {getFullName(selectedClient)}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedClient(null)
                                }
                            >
                                Close
                            </button>
                        </div>

                        <div className="trainer-clients__details-grid">
                            <div>
                                <span>Member ID</span>
                                <strong>
                                    {getMemberId(selectedClient) ?? "-"}
                                </strong>
                            </div>
                            <div>
                                <span>Email</span>
                                <strong>
                                    {getEmail(selectedClient)}
                                </strong>
                            </div>
                            <div>
                                <span>Phone</span>
                                <strong>
                                    {getPhone(selectedClient)}
                                </strong>
                            </div>
                        </div>

                        <h3>Class Bookings</h3>

                        {getClientBookings(selectedClient).length ===
                        0 ? (
                            <div className="trainer-clients__no-bookings">
                                No class bookings found for this client.
                            </div>
                        ) : (
                            <div className="trainer-clients__booking-table-wrapper">
                                <table className="trainer-clients__booking-table">
                                    <thead>
                                        <tr>
                                            <th>Booking ID</th>
                                            <th>Class</th>
                                            <th>Start Time</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getClientBookings(
                                            selectedClient
                                        ).map((booking, index) => {
                                            const status =
                                                getStatus(booking);
                                            const bookingId =
                                                getBookingId(booking);

                                            return (
                                                <tr
                                                    key={
                                                        bookingId ??
                                                        `booking-${index}`
                                                    }
                                                >
                                                    <td>
                                                        {bookingId ?? "-"}
                                                    </td>
                                                    <td>
                                                        {booking.className ||
                                                            "Class"}
                                                    </td>
                                                    <td>
                                                        {formatDateTime(
                                                            booking.startTime
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`trainer-client-booking__status trainer-client-booking__status--${status.toLowerCase()}`}
                                                        >
                                                            {status ||
                                                                "UNKNOWN"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {status ===
                                                            "CONFIRMED" && (
                                                            <button
                                                                type="button"
                                                                className="trainer-client-booking__cancel"
                                                                onClick={() =>
                                                                    setCancelTarget(
                                                                        booking
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading
                                                                }
                                                            >
                                                                Cancel Booking
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                <ConfirmationDialog
                    open={Boolean(cancelTarget)}
                    title="Cancel Class Booking"
                    message={
                        cancelTarget
                            ? `Cancel the ${
                                  cancelTarget.className || "class"
                              } booking for ${
                                  cancelTarget.memberName ||
                                  "this client"
                              }?`
                            : ""
                    }
                    confirmText="Cancel Booking"
                    onConfirm={confirmCancel}
                    onCancel={() => setCancelTarget(null)}
                    loading={actionLoading}
                />
            </div>
        </section>
    );
};

export default Clients;
