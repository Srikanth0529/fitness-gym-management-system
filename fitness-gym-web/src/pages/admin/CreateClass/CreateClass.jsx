import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClass } from "../../../services/member/classApi";
import "./CreateClass.css";

const CreateClass = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        className: "",
        description: "",
        trainerId: "",
        defaultCapacity: "",
        location: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.className.trim()) {
            setError("Class name is required.");
            return;
        }

        if (!formData.trainerId) {
            setError("Trainer ID is required.");
            return;
        }

        if (!formData.defaultCapacity) {
            setError("Class capacity is required.");
            return;
        }

        if (Number(formData.defaultCapacity) <= 0) {
            setError("Class capacity must be greater than zero.");
            return;
        }

        try {
            setLoading(true);

            await createClass({
                className: formData.className.trim(),
                description: formData.description.trim(),
                trainerId: Number(formData.trainerId),
                defaultCapacity: Number(formData.defaultCapacity),
                location: formData.location.trim()
            });

            setSuccess("Class created successfully.");

            setFormData({
                className: "",
                description: "",
                trainerId: "",
                defaultCapacity: "",
                location: ""
            });
        } catch (err) {
            console.error("Failed to create class:", err);

            setError(
                err?.response?.data?.message ||
                "Unable to create class. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="create-class">
            <div className="create-class__container">
                <header className="create-class__header">
                    <p className="create-class__eyebrow">
                        Class Management
                    </p>

                    <h1 className="create-class__title">
                        Create Class
                    </h1>

                    <p className="create-class__description">
                        Create a new fitness class and assign it to a trainer.
                    </p>
                </header>

                {error && (
                    <div className="create-class__message create-class__message--error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="create-class__message create-class__message--success">
                        {success}
                    </div>
                )}

                <form
                    className="create-class__form"
                    onSubmit={handleSubmit}
                >
                    <div className="create-class__field">
                        <label htmlFor="className">
                            Class Name
                        </label>

                        <input
                            id="className"
                            name="className"
                            type="text"
                            value={formData.className}
                            onChange={handleChange}
                            placeholder="Enter class name"
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
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter class description"
                            rows="4"
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
                                value={formData.trainerId}
                                onChange={handleChange}
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
                                value={formData.defaultCapacity}
                                onChange={handleChange}
                                placeholder="Enter capacity"
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
                            type="text"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter class location"
                            disabled={loading}
                        />
                    </div>

                    <div className="create-class__actions">
                        <button
                            type="button"
                            className="create-class__secondary-button"
                            disabled={loading}
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-class__primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default CreateClass;