const API_ENDPOINTS = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ME: "/auth/me",
    },

    MEMBERS: {
        BASE: "/members",
        BY_ID: (memberId) => `/members/${memberId}`,
        APPROVAL: (memberId) =>
            `/members/${memberId}/approval`,
    },
};

export default API_ENDPOINTS;