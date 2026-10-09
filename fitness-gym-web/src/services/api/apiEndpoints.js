const API_ENDPOINTS = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        ME: "/auth/me",
    },

    MEMBERS: {
        BASE: "/members",

        BY_ID: (memberId) =>
            `/members/${memberId}`,

        APPROVAL: (memberId) =>
            `/members/${memberId}/approval`,

        STATUS: (memberId) =>
            `/members/${memberId}/status`,
    },

    TRAINERS: {
        BASE: "/trainers",

        BY_ID: (trainerId) =>
            `/trainers/${trainerId}`,

        APPROVAL: (trainerId) =>
            `/trainers/${trainerId}/approval`,

        STATUS: (trainerId) =>
            `/trainers/${trainerId}/status`,

        CLASS_BOOKINGS: (trainerId) =>
            `/trainers/${trainerId}/class-bookings`,
    },

    CLASS_BOOKINGS: {
        BASE: "/class-bookings",

        BY_ID: (bookingId) =>
            `/class-bookings/${bookingId}`,

        CANCEL: (bookingId) =>
            `/class-bookings/${bookingId}/cancel`,
    },
};

export default API_ENDPOINTS;