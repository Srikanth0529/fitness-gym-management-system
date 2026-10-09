import axiosClient from "../api/axiosClient";

export const getMemberProfile = async (memberId) => {
    const response = await axiosClient.get(
        `/members/${memberId}`
    );

    return response.data;
};

export const updateMemberProfile = async (
    memberId,
    profileData
) => {
    const response = await axiosClient.put(
        `/members/${memberId}`,
        profileData
    );

    return response.data;
};

export const getTrainerProfile = async (
    trainerId
) => {
    const response = await axiosClient.get(
        `/trainers/${trainerId}`
    );

    return response.data;
};

export const updateTrainerProfile = async (
    trainerId,
    profileData
) => {
    const response = await axiosClient.put(
        `/trainers/${trainerId}`,
        profileData
    );

    return response.data;
};

export const getUserProfile = async (
    userId
) => {
    const response = await axiosClient.get(
        `/users/${userId}`
    );

    return response.data;
};

export const updateUserProfile = async (
    userId,
    profileData
) => {
    const response = await axiosClient.put(
        `/users/${userId}`,
        profileData
    );

    return response.data;
};