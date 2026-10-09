import axiosClient from "../api/axiosClient";

const unwrapData = (response) => {
    return response?.data?.data ?? response?.data ?? null;
};


// ============================================================
// GET ALL MEMBERS
// ============================================================

const getMembers = async () => {

    const response = await axiosClient.get(
        "/members"
    );

    return unwrapData(response);
};


// ============================================================
// GET MEMBER BY ID
// ============================================================

const getMemberById = async (
    memberId
) => {

    if (
        memberId === null ||
        memberId === undefined ||
        memberId === ""
    ) {
        throw new Error(
            "Member ID is required."
        );
    }

    const response =
        await axiosClient.get(
            `/members/${memberId}`
        );

    return unwrapData(response);
};


// ============================================================
// UPDATE MEMBER
// ============================================================

const updateMember = async (
    memberId,
    payload
) => {

    if (
        memberId === null ||
        memberId === undefined ||
        memberId === ""
    ) {
        throw new Error(
            "Member ID is required."
        );
    }

    const response =
        await axiosClient.put(
            `/members/${memberId}`,
            payload
        );

    return unwrapData(response);
};


// ============================================================
// UPDATE MEMBER APPROVAL
// ============================================================

const updateMemberApproval = async (
    memberId,
    approvalStatus
) => {
    if (
        memberId === null ||
        memberId === undefined ||
        memberId === ""
    ) {
        throw new Error("Member ID is required.");
    }

    if (
        !["APPROVED", "REJECTED"].includes(approvalStatus)
    ) {
        throw new Error(
            "Approval status must be APPROVED or REJECTED."
        );
    }

    const response = await axiosClient.patch(
        `/members/${memberId}/approval`,
        {
            approvalStatus: approvalStatus,
        }
    );

    return unwrapData(response);
};

// ============================================================
// UPDATE MEMBER ACCOUNT STATUS
// ============================================================

const updateMemberStatus = async (
    memberId,
    accountStatus
) => {

    if (
        memberId === null ||
        memberId === undefined ||
        memberId === ""
    ) {
        throw new Error(
            "Member ID is required."
        );
    }

    const response =
        await axiosClient.patch(
            `/members/${memberId}/status`,
            null,
            {
                params: {
                    accountStatus,
                },
            }
        );

    return unwrapData(response);
};


export {
    getMembers,
    getMemberById,
    updateMember,
    updateMemberApproval,
    updateMemberStatus,
};