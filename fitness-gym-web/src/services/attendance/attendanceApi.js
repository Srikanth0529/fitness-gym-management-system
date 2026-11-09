
import axiosClient from "../api/axiosClient";

const unwrapResponse = (response) =>
    response.data?.data ?? response.data;

export const memberCheckIn = async (remarks = "") => {
    const response = await axiosClient.post(
        "/attendance/check-in",
        { remarks }
    );

    return unwrapResponse(response);
};

export const memberCheckOut = async () => {
    const response = await axiosClient.post(
        "/attendance/check-out"
    );

    return unwrapResponse(response);
};

export const getMemberAttendanceHistory = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        "/attendance/my-history",
        {
            params: { startDate, endDate },
        }
    );

    return unwrapResponse(response);
};

export const trainerCheckIn = async () => {
    const response = await axiosClient.post(
        "/attendance/trainer/check-in"
    );

    return unwrapResponse(response);
};

export const trainerCheckOut = async () => {
    const response = await axiosClient.post(
        "/attendance/trainer/check-out"
    );

    return unwrapResponse(response);
};

export const getTrainerAttendanceHistory = async (
    startDate,
    endDate
) => {
    const response = await axiosClient.get(
        "/attendance/trainer/my-history",
        {
            params: { startDate, endDate },
        }
    );

    return unwrapResponse(response);
};

export const trainerMarkMemberAttendance = async (
    memberId,
    remarks = ""
) => {
    const response = await axiosClient.post(
        `/attendance/members/${memberId}/trainer-check-in`,
        { remarks }
    );

    return unwrapResponse(response);
};

export const getAdminAttendanceByDate = async (
    date,
    type
) => {
    const response = await axiosClient.get(
        "/attendance/admin/by-date",
        {
            params: { date, type },
        }
    );

    return unwrapResponse(response);
};
