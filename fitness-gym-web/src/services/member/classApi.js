import axiosClient from "../api/axiosClient";

const createClass = async (classData) => {
    const response = await axiosClient.post("/classes", classData);

    return response.data;
};

const getClasses = async (params = {}) => {
    const response = await axiosClient.get("/classes", {
        params
    });

    return response.data.data;
};

export {
    createClass,
    getClasses
};