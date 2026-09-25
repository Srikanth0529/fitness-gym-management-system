import axiosClient from "../api/axiosClient";

const getMembershipPlans = async () => {
    const response = await axiosClient.get("/membership-plans");

    return response.data;
};

const createSubscription = async (planId) => {
    const response = await axiosClient.post("/subscriptions", {
        planId
    });

    return response.data;
};

const getCurrentSubscription = async () => {
    const response = await axiosClient.get("/me/subscription");

    return response.data;
};


export {
    getMembershipPlans,
    createSubscription,
    getCurrentSubscription
};