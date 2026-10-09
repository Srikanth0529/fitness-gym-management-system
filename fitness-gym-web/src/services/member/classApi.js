import axiosClient from "../api/axiosClient";


/*
 * =========================================================
 * CREATE CLASS
 * =========================================================
 */

const createClass = async (
    classData
) => {

    const response =
        await axiosClient.post(
            "/classes",
            classData
        );

    return response.data;
};


/*
 * =========================================================
 * GET CLASSES
 * =========================================================
 */

const getClasses = async (
    params = {}
) => {

    const response =
        await axiosClient.get(
            "/classes",
            {
                params,
            }
        );

    return response.data.data;
};


/*
 * =========================================================
 * GET CLASS BY ID
 * =========================================================
 */

const getClassById = async (
    classId
) => {

    const response =
        await axiosClient.get(
            `/classes/${classId}`
        );

    return response.data.data;
};


/*
 * =========================================================
 * UPDATE CLASS
 * =========================================================
 */

const updateClass = async (
    classId,
    classData
) => {

    const response =
        await axiosClient.put(
            `/classes/${classId}`,
            classData
        );

    return response.data;
};


/*
 * =========================================================
 * UPDATE CLASS STATUS
 * =========================================================
 */

const updateClassStatus = async (
    classId,
    status
) => {

    const response =
        await axiosClient.patch(
            `/classes/${classId}/status`,
            {
                status,
            }
        );

    return response.data;
};


/*
 * =========================================================
 * CREATE CLASS OCCURRENCE
 * =========================================================
 */

const createClassOccurrence = async (
    classId,
    occurrenceData
) => {

    const response =
        await axiosClient.post(
            `/classes/${classId}/occurrences`,
            occurrenceData
        );

    return response.data;
};


/*
 * =========================================================
 * GET CLASS OCCURRENCES
 * =========================================================
 */

const getClassOccurrences = async (
    classId
) => {

    const response =
        await axiosClient.get(
            `/classes/${classId}/occurrences`
        );

    return response.data.data;
};


/*
 * =========================================================
 * GET SINGLE CLASS OCCURRENCE
 * =========================================================
 */

const getClassOccurrenceById = async (
    occurrenceId
) => {

    const response =
        await axiosClient.get(
            `/class-occurrences/${occurrenceId}`
        );

    return response.data.data;
};


/*
 * =========================================================
 * UPDATE CLASS OCCURRENCE
 * =========================================================
 */

const updateClassOccurrence = async (
    occurrenceId,
    occurrenceData
) => {

    const response =
        await axiosClient.put(
            `/class-occurrences/${occurrenceId}`,
            occurrenceData
        );

    return response.data;
};


/*
 * =========================================================
 * CANCEL CLASS OCCURRENCE
 * =========================================================
 */

const cancelClassOccurrence = async (
    occurrenceId
) => {

    const response =
        await axiosClient.post(
            `/class-occurrences/${occurrenceId}/cancel`
        );

    return response.data;
};


/*
 * =========================================================
 * EXPORTS
 * =========================================================
 */

export {
    createClass,

    getClasses,
    getClassById,

    updateClass,
    updateClassStatus,

    createClassOccurrence,
    getClassOccurrences,
    getClassOccurrenceById,
    updateClassOccurrence,
    cancelClassOccurrence,
};