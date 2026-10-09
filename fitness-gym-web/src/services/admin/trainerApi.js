import axiosClient from "../api/axiosClient";

const unwrapData = (response) => {
    return response?.data?.data ?? response?.data ?? null;
};


// ============================================================
// GET ALL TRAINERS
// ============================================================

const getTrainers = async () => {

    const response =
        await axiosClient.get(
            "/trainers"
        );

    return unwrapData(response);
};


// ============================================================
// GET TRAINER BY ID
// ============================================================

const getTrainerById = async (
    trainerId
) => {

    if (
        trainerId === null ||
        trainerId === undefined ||
        trainerId === ""
    ) {
        throw new Error(
            "Trainer ID is required."
        );
    }

    const response =
        await axiosClient.get(
            `/trainers/${trainerId}`
        );

    return unwrapData(response);
};


// ============================================================
// UPDATE TRAINER
// ============================================================

const updateTrainer = async (
    trainerId,
    payload
) => {

    if (
        trainerId === null ||
        trainerId === undefined ||
        trainerId === ""
    ) {
        throw new Error(
            "Trainer ID is required."
        );
    }

    const response =
        await axiosClient.put(
            `/trainers/${trainerId}`,
            payload
        );

    return unwrapData(response);
};


// ============================================================
// UPDATE TRAINER APPROVAL
// ============================================================
const updateTrainerApproval = async (
    trainerId,
    approvalStatus
) => {
    if (
        trainerId === null ||
        trainerId === undefined ||
        trainerId === ""
    ) {
        throw new Error("Trainer ID is required.");
    }

    if (
        !["APPROVED", "REJECTED"].includes(approvalStatus)
    ) {
        throw new Error(
            "Approval status must be APPROVED or REJECTED."
        );
    }

    const response = await axiosClient.patch(
        `/trainers/${trainerId}/approval`,
        {
            approvalStatus: approvalStatus,
        }
    );

    return unwrapData(response);
};

// ============================================================
// UPDATE TRAINER ACCOUNT STATUS
// ============================================================

const updateTrainerStatus = async (
    trainerId,
    accountStatus
) => {

    if (
        trainerId === null ||
        trainerId === undefined ||
        trainerId === ""
    ) {
        throw new Error(
            "Trainer ID is required."
        );
    }

    const response =
        await axiosClient.patch(
            `/trainers/${trainerId}/status`,
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
    getTrainers,
    getTrainerById,
    updateTrainer,
    updateTrainerApproval,
    updateTrainerStatus,
};