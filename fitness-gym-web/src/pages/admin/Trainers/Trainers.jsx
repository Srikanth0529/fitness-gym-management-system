
import { useEffect, useMemo, useState } from "react";
import {
    getTrainers,
    updateTrainer,
    updateTrainerApproval,
    updateTrainerStatus,
} from "../../../services/admin/trainerApi";
import "./Trainers.css";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "SUSPENDED", "LOCKED"];

const idOf = (trainer) => trainer?.trainerId ?? trainer?.id ?? null;
const approvalOf = (trainer) =>
    String(trainer?.approvalStatus ?? "PENDING").toUpperCase();
const statusOf = (trainer) =>
    String(trainer?.accountStatus ?? "INACTIVE").toUpperCase();
const nameOf = (trainer) =>
    `${trainer?.firstName ?? ""} ${trainer?.lastName ?? ""}`.trim() ||
    `Trainer ${idOf(trainer) ?? "-"}`;
const emailOf = (trainer) => trainer?.email ?? trainer?.user?.email ?? "-";
const phoneOf = (trainer) => trainer?.phone ?? trainer?.user?.phone ?? "-";
const errorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

const Trainers = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState(null);
    const [approvalLoadingId, setApprovalLoadingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [search, setSearch] = useState("");
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [editingTrainer, setEditingTrainer] = useState(null);

    const loadTrainers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getTrainers();
            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.content)
                    ? response.content
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.content)
                            ? response.data.content
                            : [];

            setTrainers(list);
        } catch (err) {
            console.error("Failed to load trainers:", err);
            setError(errorMessage(err, "Unable to load trainers."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTrainers();
    }, []);

    const filteredTrainers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return trainers;

        return trainers.filter((trainer) =>
            [
                idOf(trainer),
                nameOf(trainer),
                emailOf(trainer),
                phoneOf(trainer),
                trainer?.specialization,
                approvalOf(trainer),
                statusOf(trainer),
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            )
        );
    }, [trainers, search]);

    const handleEdit = (trainer) => {
        setSelectedTrainer(null);
        setError("");
        setSuccess("");

        setEditingTrainer({
            trainerId: idOf(trainer),
            firstName: trainer?.firstName ?? "",
            lastName: trainer?.lastName ?? "",
            email: emailOf(trainer) === "-" ? "" : emailOf(trainer),
            phone: phoneOf(trainer) === "-" ? "" : phoneOf(trainer),
            specialization: trainer?.specialization ?? "",
            experienceYears: trainer?.experienceYears ?? "",
            bio: trainer?.bio ?? "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditingTrainer((previous) => ({ ...previous, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        if (!editingTrainer) return;

        const id = editingTrainer.trainerId;
        if (id === null || id === undefined) {
            setError("Trainer ID is missing. Update cannot continue.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            // Keep the existing updateTrainer payload contract.
            await updateTrainer(id, {
                firstName: editingTrainer.firstName.trim(),
                lastName: editingTrainer.lastName.trim(),
                email: editingTrainer.email.trim(),
                phone: editingTrainer.phone.trim(),
                specialization: editingTrainer.specialization.trim(),
                experienceYears:
                    editingTrainer.experienceYears === ""
                        ? null
                        : Number(editingTrainer.experienceYears),
                bio: editingTrainer.bio.trim(),
            });

            setEditingTrainer(null);
            setSuccess("Trainer updated successfully.");
            await loadTrainers();
        } catch (err) {
            console.error("Failed to update trainer:", err);
            setError(errorMessage(err, "Unable to update trainer."));
        } finally {
            setSaving(false);
        }
    };

    const handleApproval = async (trainer, approvalStatus) => {
        const id = idOf(trainer);

        if (id === null || id === undefined) {
            setError("Trainer ID is missing. Approval cannot continue.");
            return;
        }

        const action = approvalStatus === "APPROVED" ? "approve" : "reject";
        if (!window.confirm(`Are you sure you want to ${action} ${nameOf(trainer)}?`)) {
            return;
        }

        try {
            setApprovalLoadingId(id);
            setError("");
            setSuccess("");

            // Keep the existing approval service and argument format.
            await updateTrainerApproval(id, approvalStatus);

            setSuccess(
                approvalStatus === "APPROVED"
                    ? "Trainer approved successfully."
                    : "Trainer rejected successfully."
            );

            await loadTrainers();
        } catch (err) {
            console.error("Failed to update trainer approval:", err);
            setError(errorMessage(err, "Unable to update trainer approval."));
        } finally {
            setApprovalLoadingId(null);
        }
    };

    const handleStatusSelect = async (trainer, status) => {
        const id = idOf(trainer);

        if (id === null || id === undefined) {
            setError("Trainer ID is missing. Status cannot be updated.");
            return;
        }
        if (status === statusOf(trainer)) return;

        if (status === "ACTIVE" && approvalOf(trainer) !== "APPROVED") {
            setError("Only approved trainers can have ACTIVE account status.");
            return;
        }

        try {
            setStatusLoadingId(id);
            setError("");
            setSuccess("");

            await updateTrainerStatus(id, status);
            setSuccess("Trainer status updated successfully.");
            await loadTrainers();
        } catch (err) {
            console.error("Failed to update trainer status:", err);
            setError(errorMessage(err, "Unable to update trainer status."));
        } finally {
            setStatusLoadingId(null);
        }
    };

    return (
        <section className="admin-trainers">
            <div className="admin-trainers__container">
                <header className="admin-trainers__header">
                    <div>
                        <p className="admin-trainers__eyebrow">Administration</p>
                        <h1>Trainer Management</h1>
                        <p>View, approve and manage gym trainers.</p>
                    </div>
                    <div className="admin-trainers__count">
                        {trainers.length} Trainers
                    </div>
                </header>

                {error && (
                    <div className="admin-trainers__message admin-trainers__message--error">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="admin-trainers__message admin-trainers__message--success">
                        {success}
                    </div>
                )}

                <div className="admin-trainers__toolbar">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by trainer ID, name, email, phone or specialization"
                    />
                </div>

                {loading ? (
                    <div className="admin-trainers__empty">Loading trainers...</div>
                ) : filteredTrainers.length === 0 ? (
                    <div className="admin-trainers__empty">
                        {search ? "No trainers match your search." : "No trainers found."}
                    </div>
                ) : (
                    <div className="admin-trainers__table-wrapper">
                        <table className="admin-trainers__table">
                            <thead>
                                <tr>
                                    <th>Trainer ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Specialization</th>
                                    <th>Experience (Years)</th>
                                    <th>Approval Status</th>
                                    <th>Account Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrainers.map((trainer, index) => {
                                    const id = idOf(trainer);
                                    const approval = approvalOf(trainer);
                                    const busy =
                                        approvalLoadingId === id ||
                                        statusLoadingId === id;

                                    return (
                                        <tr key={id ?? `trainer-${index}`}>
                                            <td>{id ?? "-"}</td>
                                            <td className="admin-trainers__name-cell">
                                                {nameOf(trainer)}
                                            </td>
                                            <td>{emailOf(trainer)}</td>
                                            <td>{phoneOf(trainer)}</td>
                                            <td>{trainer?.specialization || "-"}</td>
                                            <td>{trainer?.experienceYears ?? "-"}</td>
                                            <td>
                                                <span className={`admin-trainers__badge admin-trainers__badge--${approval.toLowerCase()}`}>
                                                    {approval}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={statusOf(trainer)}
                                                    disabled={busy || saving}
                                                    onChange={(event) =>
                                                        handleStatusSelect(trainer, event.target.value)
                                                    }
                                                    aria-label={`Account status for ${nameOf(trainer)}`}
                                                >
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-trainers__actions">
                                                    <button type="button" onClick={() => setSelectedTrainer(trainer)}>
                                                        View
                                                    </button>
                                                    <button type="button" onClick={() => handleEdit(trainer)}>
                                                        Edit
                                                    </button>
                                                    {approval !== "APPROVED" && (
                                                        <button
                                                            type="button"
                                                            className="admin-trainers__approve"
                                                            disabled={busy || saving}
                                                            onClick={() => handleApproval(trainer, "APPROVED")}
                                                        >
                                                            {approvalLoadingId === id ? "Updating..." : "Approve"}
                                                        </button>
                                                    )}
                                                    {approval !== "REJECTED" && (
                                                        <button
                                                            type="button"
                                                            className="admin-trainers__reject"
                                                            disabled={busy || saving}
                                                            onClick={() => handleApproval(trainer, "REJECTED")}
                                                        >
                                                            {approvalLoadingId === id ? "Updating..." : "Reject"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {selectedTrainer && (
                    <section className="admin-trainers__details">
                        <div className="admin-trainers__details-header">
                            <h2>Trainer Details</h2>
                            <button type="button" onClick={() => setSelectedTrainer(null)}>
                                Close
                            </button>
                        </div>
                        <div className="admin-trainers__details-grid">
                            <Detail label="Trainer ID" value={idOf(selectedTrainer)} />
                            <Detail label="Name" value={nameOf(selectedTrainer)} />
                            <Detail label="Email" value={emailOf(selectedTrainer)} />
                            <Detail label="Phone" value={phoneOf(selectedTrainer)} />
                            <Detail label="Specialization" value={selectedTrainer.specialization} />
                            <Detail label="Experience (Years)" value={selectedTrainer.experienceYears} />
                            <Detail label="Approval Status" value={approvalOf(selectedTrainer)} />
                            <Detail label="Account Status" value={statusOf(selectedTrainer)} />
                            <Detail label="Bio" value={selectedTrainer.bio} />
                        </div>
                    </section>
                )}

                {editingTrainer && (
                    <section className="admin-trainers__editor">
                        <div className="admin-trainers__editor-header">
                            <h2>Edit Trainer</h2>
                            <button type="button" onClick={() => setEditingTrainer(null)} disabled={saving}>
                                Close
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="admin-trainers__editor-grid">
                                <Field label="First Name">
                                    <input name="firstName" value={editingTrainer.firstName} onChange={handleEditChange} required />
                                </Field>
                                <Field label="Last Name">
                                    <input name="lastName" value={editingTrainer.lastName} onChange={handleEditChange} required />
                                </Field>
                                <Field label="Email">
                                    <input type="email" name="email" value={editingTrainer.email} onChange={handleEditChange} required />
                                </Field>
                                <Field label="Phone">
                                    <input name="phone" value={editingTrainer.phone} onChange={handleEditChange} />
                                </Field>
                                <Field label="Specialization">
                                    <input name="specialization" value={editingTrainer.specialization} onChange={handleEditChange} />
                                </Field>
                                <Field label="Experience (Years)">
                                    <input
                                        type="number"
                                        min="0"
                                        name="experienceYears"
                                        value={editingTrainer.experienceYears}
                                        onChange={handleEditChange}
                                    />
                                </Field>
                                <Field label="Bio" wide>
                                    <textarea name="bio" rows="4" value={editingTrainer.bio} onChange={handleEditChange} />
                                </Field>
                            </div>
                            <div className="admin-trainers__editor-actions">
                                <button type="button" onClick={() => setEditingTrainer(null)} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </div>
        </section>
    );
};

function Detail({ label, value }) {
    return (
        <div className="admin-trainers__detail">
            <span>{label}</span>
            <strong>
                {value === null || value === undefined || value === ""
                    ? "Not provided"
                    : value}
            </strong>
        </div>
    );
}

function Field({ label, wide = false, children }) {
    return (
        <label className={`admin-trainers__field${wide ? " admin-trainers__field--wide" : ""}`}>
            <span>{label}</span>
            {children}
        </label>
    );
}

export default Trainers;
