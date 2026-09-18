import axios from "axios";

import {
    ACCESS_TOKEN_KEY,
} from "../../constants/authConstants";

import {
    getStorageItem,
} from "../../utils/storage";

const axiosClient = axios.create({
    baseURL: "http://localhost:2222/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = getStorageItem(ACCESS_TOKEN_KEY);

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            console.warn("Authentication required.");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;