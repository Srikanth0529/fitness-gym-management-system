import axiosClient from "../api/axiosClient";

import API_ENDPOINTS from "../api/apiEndpoints";

export async function registerUser(registerData) {
    const response = await axiosClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        registerData
    );

    return response.data;
}

export async function loginUser(loginData) {
    const response = await axiosClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        loginData
    );

    return response.data;
}

export async function getCurrentUser() {
    const response = await axiosClient.get(
        API_ENDPOINTS.AUTH.ME
    );

    return response.data;
}