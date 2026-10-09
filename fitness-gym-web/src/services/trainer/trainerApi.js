
import axiosClient from "../api/axiosClient";

const unwrapData = (response) => {
    return response?.data?.data ?? response?.data ?? null;
};


// ============================================================
// GET TRAINER CLASS BOOKINGS
// ============================================================

const getTrainerClassBookings = async (trainerId) => {
    if (
        trainerId === null ||
        trainerId === undefined ||
        trainerId === ""
    ) {
        throw new Error("Trainer ID is required.");
    }

    const response = await axiosClient.get(
        `/trainers/${trainerId}/class-bookings`
    );

    return unwrapData(response);
};


// ============================================================
// GET TRAINER CLIENTS
//
// Trainer clients are derived from class bookings.
// ============================================================

const getTrainerClients = async (trainerId) => {
    const bookings = await getTrainerClassBookings(trainerId);

    return Array.isArray(bookings) ? bookings : [];
};


// ============================================================
// GET ONE TRAINER CLIENT
//
// Finds bookings associated with a specific member.
// ============================================================

const getTrainerClient = async (trainerId, memberId) => {
    if (
        memberId === null ||
        memberId === undefined ||
        memberId === ""
    ) {
        throw new Error("Member ID is required.");
    }

    const bookings = await getTrainerClassBookings(trainerId);

    if (!Array.isArray(bookings)) {
        return [];
    }

    return bookings.filter(
        (booking) =>
            String(
                booking?.memberId ??
                booking?.member?.memberId ??
                booking?.member?.id ??
                ""
            ) === String(memberId)
    );
};


// ============================================================
// CANCEL TRAINER CLASS BOOKING
//
// Cancellation is intentionally disabled until the backend
// cancellation endpoint is confirmed.
// ============================================================

const cancelTrainerClassBooking = async (bookingId) => {
    if (
        bookingId === null ||
        bookingId === undefined ||
        bookingId === ""
    ) {
        throw new Error("Booking ID is required.");
    }

    throw new Error(
        "Booking cancellation is not configured. " +
        "Verify the backend cancellation endpoint first."
    );
};


// ============================================================
// EXPORTS
// ============================================================

export {
    getTrainerClients,
    getTrainerClient,
    getTrainerClassBookings,
    cancelTrainerClassBooking,
};
