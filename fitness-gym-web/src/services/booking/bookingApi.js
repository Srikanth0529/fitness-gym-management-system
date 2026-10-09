import axiosClient from "../api/axiosClient";

/*
 * =========================================================
 * MEMBER - BOOK CLASS
 * =========================================================
 */

const bookClass = async (
    memberId,
    occurrenceId
) => {

    const response =
        await axiosClient.post(
            `/members/${memberId}/class-occurrences/${occurrenceId}/bookings`
        );

    return response.data;
};


/*
 * =========================================================
 * MEMBER - EXISTING CANCEL ENDPOINT
 *
 * Kept for compatibility with the existing frontend.
 * =========================================================
 */

const cancelMemberBooking = async (
    memberId,
    bookingId
) => {

    const response =
        await axiosClient.post(
            `/members/${memberId}/class-bookings/${bookingId}/cancel`
        );

    return response.data;
};


/*
 * =========================================================
 * CLASS BOOKINGS
 * =========================================================
 */

const getBookings = async (
    params = {}
) => {

    const response =
        await axiosClient.get(
            "/class-bookings",
            {
                params,
            }
        );

    return response.data.data;
};


/*
 * =========================================================
 * GET BOOKING BY ID
 * =========================================================
 */

const getBookingById = async (
    bookingId
) => {

    const response =
        await axiosClient.get(
            `/class-bookings/${bookingId}`
        );

    return response.data.data;
};


/*
 * =========================================================
 * SHARED CANCEL BOOKING
 *
 * MEMBER  -> own booking
 * TRAINER -> booking for own class
 * ADMIN   -> any booking
 * =========================================================
 */

const cancelBooking = async (
    bookingId
) => {

    const response =
        await axiosClient.post(
            `/class-bookings/${bookingId}/cancel`
        );

    return response.data;
};


export {
    bookClass,
    cancelMemberBooking,
    getBookings,
    getBookingById,
    cancelBooking,
};