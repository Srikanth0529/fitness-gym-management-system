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