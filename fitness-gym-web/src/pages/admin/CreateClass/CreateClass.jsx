import {
    useEffect,
    useState,
} from "react";

import {
    createClass,
    getClasses,
    getClassOccurrences,
    updateClass,
    updateClassStatus,
    createClassOccurrence,
    updateClassOccurrence,
    cancelClassOccurrence,
} from "../../../services/member/classApi";

import useAuth from "../../../hooks/useAuth";

import "./CreateClass.css";


const CreateClass = () => {

    const {
        user,
    } = useAuth();


    const isAdmin =
        user?.role === "ADMIN";

    const isTrainer =
        user?.role === "TRAINER";


    // =========================================================
    // PAGE VIEW
    // =========================================================

    /*
     * list
     *      -> default screen
     *
     * class-form
     *      -> create / edit class
     *
     * occurrence-form
     *      -> create / edit occurrence
     */

    const [view, setView] =
        useState("list");


    // =========================================================
    // CLASS FORM
    // =========================================================

    const emptyClassForm = {
        className: "",
        description: "",
        trainerId: "",
        defaultCapacity: "",
        location: "",
    };


    const [classForm, setClassForm] =
        useState(emptyClassForm);


    const [editingClassId, setEditingClassId] =
        useState(null);


    // =========================================================
    // OCCURRENCE FORM
    // =========================================================

    const emptyOccurrenceForm = {
        startTime: "",
        endTime: "",
        capacity: "",
    };


    const [occurrenceForm, setOccurrenceForm] =
        useState(emptyOccurrenceForm);


    const [occurrenceClassId, setOccurrenceClassId] =
        useState(null);


    const [editingOccurrenceId, setEditingOccurrenceId] =
        useState(null);


    // =========================================================
    // DATA
    // =========================================================

    const [classes, setClasses] =
        useState([]);


    const [occurrences, setOccurrences] =
        useState({});


    // =========================================================
    // UI STATE
    // =========================================================

    const [loading, setLoading] =
        useState(false);


    const [classesLoading, setClassesLoading] =
        useState(true);


    const [occurrenceLoading, setOccurrenceLoading] =
        useState({});


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    // =========================================================
    // LOAD CLASSES
    // =========================================================

    const loadClasses = async () => {

        try {

            setClassesLoading(true);

            setError("");

            const data =
                await getClasses();

            setClasses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load classes:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load classes."
            );

        } finally {

            setClassesLoading(false);
        }
    };


    // =========================================================
    // LOAD OCCURRENCES
    // =========================================================

    const loadOccurrences = async (
        classId
    ) => {

        try {

            setOccurrenceLoading(
                previous => ({
                    ...previous,
                    [classId]: true,
                })
            );

            const data =
                await getClassOccurrences(
                    classId
                );

            setOccurrences(
                previous => ({
                    ...previous,
                    [classId]:
                        Array.isArray(data)
                            ? data
                            : [],
                })
            );

        } catch (err) {

            console.error(
                "Failed to load occurrences:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load class occurrences."
            );

        } finally {

            setOccurrenceLoading(
                previous => ({
                    ...previous,
                    [classId]: false,
                })
            );
        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadClasses();

    }, []);


    // =========================================================
    // LOAD OCCURRENCES AFTER CLASSES LOAD
    // =========================================================

    useEffect(() => {

        if (!classes.length) {

            setOccurrences({});

            return;
        }

        classes.forEach(
            gymClass => {

                loadOccurrences(
                    gymClass.classId
                );

            }
        );

    }, [classes]);


    // =========================================================
    // CLASS FORM CHANGE
    // =========================================================

    const handleClassChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setClassForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };


    // =========================================================
    // OCCURRENCE FORM CHANGE
    // =========================================================

    const handleOccurrenceChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setOccurrenceForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );
    };


    // =========================================================
    // CLEAR MESSAGES
    // =========================================================

    const clearMessages = () => {

        setError("");

        setSuccess("");
    };


    // =========================================================
    // RESET CLASS FORM
    // =========================================================

    const resetClassForm = () => {

        setClassForm(
            emptyClassForm
        );

        setEditingClassId(null);
    };


    // =========================================================
    // RESET OCCURRENCE FORM
    // =========================================================

    const resetOccurrenceForm = () => {

        setOccurrenceForm(
            emptyOccurrenceForm
        );

        setOccurrenceClassId(null);

        setEditingOccurrenceId(null);
    };


    // =========================================================
    // GO TO CLASS LIST
    // =========================================================

    const goToClassList = () => {

        resetClassForm();

        resetOccurrenceForm();

        setView("list");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // OPEN CREATE CLASS
    // =========================================================

    const handleCreateClass = () => {

        clearMessages();

        resetClassForm();

        setView("class-form");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // CREATE / UPDATE CLASS
    // =========================================================

    const handleClassSubmit = async (
        event
    ) => {

        event.preventDefault();

        clearMessages();


        if (!classForm.className.trim()) {

            setError(
                "Class name is required."
            );

            return;
        }


        if (!classForm.trainerId) {

            setError(
                "Trainer ID is required."
            );

            return;
        }


        if (
            !classForm.defaultCapacity ||
            Number(
                classForm.defaultCapacity
            ) <= 0
        ) {

            setError(
                "Capacity must be greater than zero."
            );

            return;
        }


        const payload = {

            className:
                classForm.className.trim(),

            description:
                classForm.description.trim(),

            trainerId:
                Number(
                    classForm.trainerId
                ),

            defaultCapacity:
                Number(
                    classForm.defaultCapacity
                ),

            location:
                classForm.location.trim(),
        };


        try {

            setLoading(true);


            if (editingClassId) {

                await updateClass(
                    editingClassId,
                    payload
                );

                setSuccess(
                    "Class updated successfully."
                );

            } else {

                await createClass(
                    payload
                );

                setSuccess(
                    "Class created successfully."
                );
            }


            resetClassForm();

            await loadClasses();

            setView("list");

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (err) {

            console.error(
                "Class operation failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to save class."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // EDIT CLASS
    // =========================================================

    const handleEditClass = (
        gymClass
    ) => {

        clearMessages();

        setEditingClassId(
            gymClass.classId
        );

        setClassForm({

            className:
                gymClass.className || "",

            description:
                gymClass.description || "",

            trainerId:
                gymClass.trainerId
                    ? String(
                        gymClass.trainerId
                    )
                    : "",

            defaultCapacity:
                gymClass.defaultCapacity
                    ? String(
                        gymClass.defaultCapacity
                    )
                    : "",

            location:
                gymClass.location || "",
        });

        setView("class-form");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // CHANGE CLASS STATUS
    // =========================================================

    const handleClassStatus = async (
        gymClass
    ) => {

        const newStatus =
            String(
                gymClass.classStatus
            ).toUpperCase() ===
            "CANCELLED"
                ? "ACTIVE"
                : "CANCELLED";


        try {

            clearMessages();

            setLoading(true);

            await updateClassStatus(
                gymClass.classId,
                newStatus
            );

            setSuccess(
                `Class ${newStatus.toLowerCase()} successfully.`
            );

            await loadClasses();

        } catch (err) {

            console.error(
                "Failed to update class status:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to update class status."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // OPEN CREATE OCCURRENCE
    // =========================================================

    const handleCreateOccurrence = (
        classId,
        defaultCapacity
    ) => {

        clearMessages();

        setOccurrenceClassId(
            classId
        );

        setEditingOccurrenceId(
            null
        );

        setOccurrenceForm({

            startTime: "",

            endTime: "",

            capacity:
                defaultCapacity
                    ? String(
                        defaultCapacity
                    )
                    : "",
        });

        setView("occurrence-form");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // EDIT OCCURRENCE
    // =========================================================

    const handleEditOccurrence = (
        occurrence
    ) => {

        clearMessages();

        setOccurrenceClassId(
            occurrence.classId
        );

        setEditingOccurrenceId(
            occurrence.occurrenceId
        );

        setOccurrenceForm({

            startTime:
                occurrence.startTime
                    ? occurrence.startTime.slice(
                        0,
                        16
                    )
                    : "",

            endTime:
                occurrence.endTime
                    ? occurrence.endTime.slice(
                        0,
                        16
                    )
                    : "",

            capacity:
                occurrence.capacity
                    ? String(
                        occurrence.capacity
                    )
                    : "",
        });

        setView("occurrence-form");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // =========================================================
    // CREATE / UPDATE OCCURRENCE
    // =========================================================

    const handleOccurrenceSubmit =
        async (
            event
        ) => {

            event.preventDefault();

            clearMessages();


            if (!occurrenceClassId) {

                setError(
                    "Class is required."
                );

                return;
            }


            if (
                !occurrenceForm.startTime ||
                !occurrenceForm.endTime
            ) {

                setError(
                    "Start time and end time are required."
                );

                return;
            }


            if (
                !occurrenceForm.capacity ||
                Number(
                    occurrenceForm.capacity
                ) <= 0
            ) {

                setError(
                    "Occurrence capacity must be greater than zero."
                );

                return;
            }


            const payload = {

                startTime:
                    occurrenceForm.startTime,

                endTime:
                    occurrenceForm.endTime,

                capacity:
                    Number(
                        occurrenceForm.capacity
                    ),
            };


            try {

                setLoading(true);


                if (
                    editingOccurrenceId
                ) {

                    await updateClassOccurrence(
                        editingOccurrenceId,
                        payload
                    );

                    setSuccess(
                        "Occurrence updated successfully."
                    );

                } else {

                    await createClassOccurrence(
                        occurrenceClassId,
                        payload
                    );

                    setSuccess(
                        "Occurrence created successfully."
                    );
                }


                const classId =
                    occurrenceClassId;


                resetOccurrenceForm();

                await loadOccurrences(
                    classId
                );

                setView("list");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

            } catch (err) {

                console.error(
                    "Occurrence operation failed:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to save occurrence."
                );

            } finally {

                setLoading(false);
            }
        };


    // =========================================================
    // CANCEL OCCURRENCE
    // =========================================================

    const handleCancelOccurrence =
        async (
            occurrence
        ) => {

            try {

                clearMessages();

                setLoading(true);

                await cancelClassOccurrence(
                    occurrence.occurrenceId
                );

                setSuccess(
                    "Occurrence cancelled successfully."
                );

                await loadOccurrences(
                    occurrence.classId
                );

            } catch (err) {

                console.error(
                    "Failed to cancel occurrence:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to cancel occurrence."
                );

            } finally {

                setLoading(false);
            }
        };


    // =========================================================
    // FORMAT DATE/TIME
    // =========================================================

    const formatDateTime = (
        value
    ) => {

        if (!value) {

            return "Not scheduled";
        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;
        }


        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };


    // =========================================================
    // PAGE HEADER
    // =========================================================

    const renderHeader = () => {

        if (view === "list") {

            return (

                <header className="create-class__header">

                    <div>

                        <p className="create-class__eyebrow">
                            Class Management
                        </p>

                        <h1 className="create-class__title">
                            {isAdmin
                                ? "Manage Gym Classes"
                                : "Manage My Classes"}
                        </h1>

                        <p className="create-class__description">
                            View and manage your gym classes and schedules.
                        </p>

                    </div>


                    {(isAdmin || isTrainer) && (

                        <button
                            type="button"
                            className="create-class__primary-button create-class__create-button"
                            onClick={
                                handleCreateClass
                            }
                        >
                            + Create Class
                        </button>

                    )}

                </header>
            );
        }


        if (view === "class-form") {

            return (

                <header className="create-class__header create-class__header--form">

                    <button
                        type="button"
                        className="create-class__back-button"
                        onClick={
                            goToClassList
                        }
                        disabled={loading}
                    >
                        ← Back to Classes
                    </button>


                    <div className="create-class__form-heading">

                        <p className="create-class__eyebrow">
                            Class Management
                        </p>

                        <h1 className="create-class__title">
                            {editingClassId
                                ? "Edit Class"
                                : "Create New Class"}
                        </h1>

                        <p className="create-class__description">
                            {editingClassId
                                ? "Update the class information below."
                                : "Create a fitness class and assign its trainer."}
                        </p>

                    </div>

                </header>
            );
        }


        return (

            <header className="create-class__header create-class__header--form">

                <button
                    type="button"
                    className="create-class__back-button"
                    onClick={
                        goToClassList
                    }
                    disabled={loading}
                >
                    ← Back to Classes
                </button>


                <div className="create-class__form-heading">

                    <p className="create-class__eyebrow">
                        Class Schedule
                    </p>

                    <h1 className="create-class__title">
                        {editingOccurrenceId
                            ? "Edit Occurrence"
                            : "Schedule Class"}
                    </h1>

                    <p className="create-class__description">
                        Schedule a class occurrence with its date, time and capacity.
                    </p>

                </div>

            </header>
        );
    };


    // =========================================================
    // CLASS FORM VIEW
    // =========================================================

    const renderClassForm = () => {

        return (

            <section className="create-class__form-page">

                <div className="create-class__form-card">

                    <div className="create-class__form-card-header">

                        <div>

                            <p className="create-class__form-label">
                                CLASS INFORMATION
                            </p>

                            <h2>
                                {editingClassId
                                    ? "Update class details"
                                    : "Add a new fitness class"}
                            </h2>

                        </div>

                    </div>


                    <form
                        className="create-class__form"
                        onSubmit={
                            handleClassSubmit
                        }
                    >

                        <div className="create-class__field">

                            <label htmlFor="className">
                                Class Name
                            </label>

                            <input
                                id="className"
                                name="className"
                                value={
                                    classForm.className
                                }
                                onChange={
                                    handleClassChange
                                }
                                placeholder="e.g. Yoga, Zumba, Strength Training"
                                disabled={loading}
                            />

                        </div>


                        <div className="create-class__field">

                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows="5"
                                value={
                                    classForm.description
                                }
                                onChange={
                                    handleClassChange
                                }
                                placeholder="Describe the class..."
                                disabled={loading}
                            />

                        </div>


                        <div className="create-class__form-row">

                            <div className="create-class__field">

                                <label htmlFor="trainerId">
                                    Trainer ID
                                </label>

                                <input
                                    id="trainerId"
                                    name="trainerId"
                                    type="number"
                                    min="1"
                                    value={
                                        classForm.trainerId
                                    }
                                    onChange={
                                        handleClassChange
                                    }
                                    placeholder="Enter trainer ID"
                                    disabled={loading}
                                />

                            </div>


                            <div className="create-class__field">

                                <label htmlFor="defaultCapacity">
                                    Capacity
                                </label>

                                <input
                                    id="defaultCapacity"
                                    name="defaultCapacity"
                                    type="number"
                                    min="1"
                                    value={
                                        classForm.defaultCapacity
                                    }
                                    onChange={
                                        handleClassChange
                                    }
                                    placeholder="Maximum capacity"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        <div className="create-class__field">

                            <label htmlFor="location">
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                value={
                                    classForm.location
                                }
                                onChange={
                                    handleClassChange
                                }
                                placeholder="e.g. Studio 1, Gym Floor"
                                disabled={loading}
                            />

                        </div>


                        <div className="create-class__form-actions">

                            <button
                                type="button"
                                className="create-class__secondary-button"
                                onClick={
                                    goToClassList
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="create-class__primary-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingClassId
                                        ? "Update Class"
                                        : "Create Class"}
                            </button>

                        </div>

                    </form>

                </div>

            </section>
        );
    };


    // =========================================================
    // OCCURRENCE FORM VIEW
    // =========================================================

    const renderOccurrenceForm = () => {

        const selectedClass =
            classes.find(
                gymClass =>
                    gymClass.classId ===
                    occurrenceClassId
            );


        return (

            <section className="create-class__form-page">

                <div className="create-class__form-card">

                    <div className="create-class__form-card-header">

                        <div>

                            <p className="create-class__form-label">
                                CLASS SCHEDULE
                            </p>

                            <h2>
                                {selectedClass?.className ||
                                    "Class Schedule"}
                            </h2>

                            <p>
                                {selectedClass?.location ||
                                    "Gym location not specified"}
                            </p>

                        </div>

                    </div>


                    <form
                        className="create-class__form"
                        onSubmit={
                            handleOccurrenceSubmit
                        }
                    >

                        <div className="create-class__form-row">

                            <div className="create-class__field">

                                <label htmlFor="startTime">
                                    Start Date & Time
                                </label>

                                <input
                                    id="startTime"
                                    type="datetime-local"
                                    name="startTime"
                                    value={
                                        occurrenceForm.startTime
                                    }
                                    onChange={
                                        handleOccurrenceChange
                                    }
                                    disabled={loading}
                                />

                            </div>


                            <div className="create-class__field">

                                <label htmlFor="endTime">
                                    End Date & Time
                                </label>

                                <input
                                    id="endTime"
                                    type="datetime-local"
                                    name="endTime"
                                    value={
                                        occurrenceForm.endTime
                                    }
                                    onChange={
                                        handleOccurrenceChange
                                    }
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        <div className="create-class__field">

                            <label htmlFor="capacity">
                                Occurrence Capacity
                            </label>

                            <input
                                id="capacity"
                                type="number"
                                min="1"
                                name="capacity"
                                value={
                                    occurrenceForm.capacity
                                }
                                onChange={
                                    handleOccurrenceChange
                                }
                                placeholder="Maximum number of members"
                                disabled={loading}
                            />

                        </div>


                        <div className="create-class__form-actions">

                            <button
                                type="button"
                                className="create-class__secondary-button"
                                onClick={
                                    goToClassList
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="create-class__primary-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingOccurrenceId
                                        ? "Update Occurrence"
                                        : "Create Occurrence"}
                            </button>

                        </div>

                    </form>

                </div>

            </section>
        );
    };


    // =========================================================
    // CLASS LIST VIEW
    // =========================================================

    const renderClassList = () => {

        return (

            <section className="create-class__list-section">

                <div className="create-class__list-header">

                    <div>

                        <p className="create-class__section-label">
                            CLASS DIRECTORY
                        </p>

                        <h2>
                            {isAdmin
                                ? "All Classes"
                                : "My Classes"}
                        </h2>

                        <p>
                            View classes, trainers and scheduled occurrences.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="create-class__secondary-button"
                        onClick={
                            loadClasses
                        }
                        disabled={
                            classesLoading
                        }
                    >
                        {classesLoading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>


                {classesLoading ? (

                    <div className="create-class__state">

                        <div className="create-class__loader" />

                        <p>
                            Loading classes...
                        </p>

                    </div>

                ) : classes.length === 0 ? (

                    <div className="create-class__empty">

                        <div className="create-class__empty-icon">
                            +
                        </div>

                        <h3>
                            No classes available
                        </h3>

                        <p>
                            Create your first fitness class to get started.
                        </p>


                        {(isAdmin || isTrainer) && (

                            <button
                                type="button"
                                className="create-class__primary-button"
                                onClick={
                                    handleCreateClass
                                }
                            >
                                + Create Class
                            </button>

                        )}

                    </div>

                ) : (

                    <div className="class-management__grid">

                        {classes.map(
                            gymClass => {

                                const classOccurrences =
                                    occurrences[
                                        gymClass.classId
                                    ] || [];


                                const isCancelled =
                                    String(
                                        gymClass.classStatus
                                    ).toUpperCase() ===
                                    "CANCELLED";


                                return (

                                    <article
                                        className="managed-class"
                                        key={
                                            gymClass.classId
                                        }
                                    >

                                        <div className="managed-class__header">

                                            <div>

                                                <p className="managed-class__label">
                                                    FITNESS CLASS
                                                </p>

                                                <h3 className="managed-class__name">
                                                    {
                                                        gymClass.className
                                                    }
                                                </h3>

                                            </div>


                                            <span
                                                className={`managed-class__status managed-class__status--${String(
                                                    gymClass.classStatus
                                                ).toLowerCase()}`}
                                            >
                                                {
                                                    gymClass.classStatus
                                                }
                                            </span>

                                        </div>


                                        <p className="managed-class__description">

                                            {
                                                gymClass.description ||
                                                "No description available."
                                            }

                                        </p>


                                        <div className="managed-class__details">

                                            <div>

                                                <span>
                                                    Trainer
                                                </span>

                                                <strong>
                                                    
                                                    {
                                                        gymClass.trainerId
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Capacity
                                                </span>

                                                <strong>
                                                    {
                                                        gymClass.defaultCapacity
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {
                                                        gymClass.location ||
                                                        "Not specified"
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {(isAdmin ||
                                            isTrainer) && (

                                            <div className="managed-class__actions">

                                                <button
                                                    type="button"
                                                    className="class-action-button"
                                                    onClick={() =>
                                                        handleEditClass(
                                                            gymClass
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    className={`class-action-button ${
                                                        isCancelled
                                                            ? "class-action-button--success"
                                                            : "class-action-button--danger"
                                                    }`}
                                                    onClick={() =>
                                                        handleClassStatus(
                                                            gymClass
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                >
                                                    {isCancelled
                                                        ? "Activate"
                                                        : "Cancel Class"}
                                                </button>


                                                {!isCancelled && (

                                                    <button
                                                        type="button"
                                                        className="class-action-button class-action-button--primary"
                                                        onClick={() =>
                                                            handleCreateOccurrence(
                                                                gymClass.classId,
                                                                gymClass.defaultCapacity
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                    >
                                                        + Add Occurrence
                                                    </button>

                                                )}

                                            </div>

                                        )}


                                        <div className="managed-class__schedule">

                                            <div className="managed-class__schedule-header">

                                                <div>

                                                    <h4>
                                                        Scheduled Occurrences
                                                    </h4>

                                                    <p>
                                                        Upcoming class sessions
                                                    </p>

                                                </div>


                                                <span>
                                                    {
                                                        classOccurrences.length
                                                    }
                                                </span>

                                            </div>


                                            {occurrenceLoading[
                                                gymClass.classId
                                            ] ? (

                                                <p className="managed-class__empty">
                                                    Loading occurrences...
                                                </p>

                                            ) : classOccurrences.length ===
                                              0 ? (

                                                <p className="managed-class__empty">
                                                    No scheduled occurrences.
                                                </p>

                                            ) : (

                                                <div className="managed-occurrence-list">

                                                    {classOccurrences.map(
                                                        occurrence => {

                                                            const occurrenceCancelled =
                                                                String(
                                                                    occurrence.occurrenceStatus
                                                                ).toUpperCase() ===
                                                                "CANCELLED";


                                                            return (

                                                                <div
                                                                    className="managed-occurrence"
                                                                    key={
                                                                        occurrence.occurrenceId
                                                                    }
                                                                >

                                                                    <div className="managed-occurrence__information">

                                                                        <div>

                                                                            <span>
                                                                                Start
                                                                            </span>

                                                                            <strong>
                                                                                {
                                                                                    formatDateTime(
                                                                                        occurrence.startTime
                                                                                    )
                                                                                }
                                                                            </strong>

                                                                        </div>


                                                                        <div>

                                                                            <span>
                                                                                End
                                                                            </span>

                                                                            <strong>
                                                                                {
                                                                                    formatDateTime(
                                                                                        occurrence.endTime
                                                                                    )
                                                                                }
                                                                            </strong>

                                                                        </div>


                                                                        <div>

                                                                            <span>
                                                                                Capacity
                                                                            </span>

                                                                            <strong>
                                                                                {
                                                                                    occurrence.currentBookings
                                                                                }
                                                                                /
                                                                                {
                                                                                    occurrence.capacity
                                                                                }
                                                                            </strong>

                                                                        </div>


                                                                        <div>

                                                                            <span>
                                                                                Status
                                                                            </span>

                                                                            <strong>
                                                                                {
                                                                                    occurrence.occurrenceStatus
                                                                                }
                                                                            </strong>

                                                                        </div>

                                                                    </div>


                                                                    {(isAdmin ||
                                                                        isTrainer) && (

                                                                        <div className="managed-occurrence__actions">

                                                                            {!occurrenceCancelled && (

                                                                                <>

                                                                                    <button
                                                                                        type="button"
                                                                                        className="class-action-button"
                                                                                        onClick={() =>
                                                                                            handleEditOccurrence(
                                                                                                occurrence
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            loading
                                                                                        }
                                                                                    >
                                                                                        Edit
                                                                                    </button>


                                                                                    <button
                                                                                        type="button"
                                                                                        className="class-action-button class-action-button--danger"
                                                                                        onClick={() =>
                                                                                            handleCancelOccurrence(
                                                                                                occurrence
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            loading
                                                                                        }
                                                                                    >
                                                                                        Cancel
                                                                                    </button>

                                                                                </>

                                                                            )}

                                                                        </div>

                                                                    )}

                                                                </div>

                                                            );

                                                        }
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>
        );
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <section className="create-class">

            <div className="create-class__container">

                {renderHeader()}


                {/* =================================================
                    GLOBAL MESSAGES
                ================================================== */}

                {error && (

                    <div className="create-class__message create-class__message--error">

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {success && view === "list" && (

                    <div className="create-class__message create-class__message--success">

                        <span>
                            {success}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccess("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    DEFAULT LIST VIEW
                ================================================== */}

                {view === "list" &&
                    renderClassList()}


                {/* =================================================
                    CREATE / EDIT CLASS VIEW
                ================================================== */}

                {view === "class-form" &&
                    renderClassForm()}


                {/* =================================================
                    CREATE / EDIT OCCURRENCE VIEW
                ================================================== */}

                {view === "occurrence-form" &&
                    renderOccurrenceForm()}

            </div>

        </section>
    );
};


export default CreateClass;