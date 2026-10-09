
import { useEffect, useMemo, useState } from "react";
import {
    getMembers,
    updateMember,
    updateMemberApproval,
    updateMemberStatus,
} from "../../../services/admin/memberApi";
import "./Members.css";

const APPROVED = "APPROVED";
const ACCOUNT_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED", "LOCKED"];

const memberIdOf = (member) => member?.memberId ?? member?.id ?? null;
const userIdOf = (member) => member?.userId ?? member?.user?.id ?? null;
const nameOf = (member) =>
    `${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim() || "Unnamed Member";
const emailOf = (member) => member?.email ?? member?.user?.email ?? "-";
const phoneOf = (member) => member?.phone ?? member?.user?.phone ?? "-";
const approvalOf = (member) =>
    String(member?.approvalStatus ?? "PENDING").toUpperCase();
const statusOf = (member) =>
    String(member?.accountStatus ?? "INACTIVE").toUpperCase();
const errorMessage = (error, fallback) =>
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback;

const Members = () => {
    const [members, setMembers] = useState([]);
    const [view, setView] = useState("approved");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState(null);
    const [approvalLoadingId, setApprovalLoadingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingMember, setEditingMember] = useState(null);
    const [viewingMember, setViewingMember] = useState(null);
    const [editForm, setEditForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
    });

    const loadMembers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getMembers();
            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.content)
                    ? response.content
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response?.data?.content)
                            ? response.data.content
                            : [];

            setMembers(list);
        } catch (err) {
            console.error("Failed to load members:", err);
            setError(errorMessage(err, "Unable to load members."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const approvedCount = useMemo(
        () => members.filter((member) => approvalOf(member) === APPROVED).length,
        [members]
    );

    const nonApprovedCount = members.length - approvedCount;

    const visibleMembers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return members.filter((member) => {
            const approval = approvalOf(member);
            const belongsToTab =
                view === "approved"
                    ? approval === APPROVED
                    : approval !== APPROVED;

            if (!belongsToTab) return false;
            if (!query) return true;

            return [
                memberIdOf(member),
                userIdOf(member),
                nameOf(member),
                emailOf(member),
                phoneOf(member),
                approval,
                statusOf(member),
            ].some((value) =>
                String(value ?? "").toLowerCase().includes(query)
            );
        });
    }, [members, search, view]);

    const openEdit = (member) => {
        const id = memberIdOf(member);

        if (id === null || id === undefined) {
            setError("Member ID is missing. The member cannot be edited.");
            return;
        }

        setError("");
        setSuccess("");
        setViewingMember(null);
        setEditingMember(member);

        setEditForm({
            firstName: member?.firstName ?? "",
            lastName: member?.lastName ?? "",
            email: emailOf(member) === "-" ? "" : emailOf(member),
            phone: phoneOf(member) === "-" ? "" : phoneOf(member),
            dateOfBirth: member?.dateOfBirth
                ? String(member.dateOfBirth).slice(0, 10)
                : "",
            gender: member?.gender ?? "",
            address: member?.address ?? "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        const id = memberIdOf(editingMember);
        if (id === null || id === undefined) {
            setError("Member ID is missing. Update cannot continue.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            // Keep the existing updateMember payload contract.
            await updateMember(id, {
                firstName: editForm.firstName.trim(),
                lastName: editForm.lastName.trim(),
                phone: editForm.phone.trim(),
                dateOfBirth: editForm.dateOfBirth || null,
                gender: editForm.gender || null,
                address: editForm.address.trim(),
            });

            setEditingMember(null);
            setSuccess("Member updated successfully.");
            await loadMembers();
        } catch (err) {
            console.error("Failed to update member:", err);
            setError(errorMessage(err, "Unable to update member."));
        } finally {
            setSaving(false);
        }
    };

    const handleApproval = async (member, approvalStatus) => {
        const id = memberIdOf(member);

        if (id === null || id === undefined) {
            setError("Member ID is missing. Approval cannot continue.");
            return;
        }

        const action = approvalStatus === APPROVED ? "approve" : "reject";
        if (!window.confirm(`Are you sure you want to ${action} ${nameOf(member)}?`)) {
            return;
        }

        try {
            setApprovalLoadingId(id);
            setError("");
            setSuccess("");

            // Preserve the existing service method and argument format.
            await updateMemberApproval(id, approvalStatus);

            setSuccess(
                approvalStatus === APPROVED
                    ? "Member approved successfully."
                    : "Member rejected successfully."
            );

            await loadMembers();
        } catch (err) {
            console.error("Failed to update member approval:", err);
            setError(errorMessage(err, "Unable to update member approval."));
        } finally {
            setApprovalLoadingId(null);
        }
    };

    const handleAccountStatus = async (member, accountStatus) => {
        const id = memberIdOf(member);
        if (id === null || id === undefined) {
            setError("Member ID is missing. Status cannot be updated.");
            return;
        }

        if (accountStatus === statusOf(member)) return;

        // An account must be approved before it can be made ACTIVE.
        if (accountStatus === "ACTIVE" && approvalOf(member) !== APPROVED) {
            setError("Only approved members can have ACTIVE account status.");
            return;
        }

        try {
            setStatusLoadingId(id);
            setError("");
            setSuccess("");

            await updateMemberStatus(id, accountStatus);
            setSuccess("Member account status updated successfully.");
            await loadMembers();
        } catch (err) {
            console.error("Failed to update member status:", err);
            setError(errorMessage(err, "Unable to update member status."));
        } finally {
            setStatusLoadingId(null);
        }
    };

    return (
        <section className="admin-members">
            <div className="admin-members__container">
                <header className="admin-members__header">
                    <div>
                        <p className="admin-members__eyebrow">Administration</p>
                        <h1>Member Management</h1>
                        <p>Review member applications and manage member accounts.</p>
                    </div>
                    <div className="admin-members__count">{members.length} Members</div>
                </header>

                {error && (
                    <div className="admin-members__message admin-members__message--error">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="admin-members__message admin-members__message--success">
                        {success}
                    </div>
                )}

                <div className="admin-members__tabs">
                    <button
                        type="button"
                        className={view === "approved" ? "is-active" : ""}
                        onClick={() => setView("approved")}
                    >
                        Approved <span>{approvedCount}</span>
                    </button>
                    <button
                        type="button"
                        className={view === "non-approved" ? "is-active" : ""}
                        onClick={() => setView("non-approved")}
                    >
                        Non-Approved <span>{nonApprovedCount}</span>
                    </button>
                </div>

                <div className="admin-members__toolbar">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by member ID, user ID, name, email or phone"
                    />
                </div>

                {loading ? (
                    <div className="admin-members__state">Loading members...</div>
                ) : visibleMembers.length === 0 ? (
                    <div className="admin-members__state">
                        {search
                            ? "No members match your search."
                            : view === "approved"
                                ? "No approved members found."
                                : "No non-approved members found."}
                    </div>
                ) : (
                    <div className="admin-members__table-wrapper">
                        <table className="admin-members__table">
                            <thead>
                                <tr>
                                    <th>Member ID</th>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Approval Status</th>
                                    <th>Account Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleMembers.map((member, index) => {
                                    const id = memberIdOf(member);
                                    const approval = approvalOf(member);
                                    const approved = approval === APPROVED;
                                    const busy =
                                        approvalLoadingId === id ||
                                        statusLoadingId === id;

                                    return (
                                        <tr key={id ?? `member-${index}`}>
                                            <td>{id ?? "-"}</td>
                                            <td>{userIdOf(member) ?? "-"}</td>
                                            <td className="admin-members__name-cell">
                                                {nameOf(member)}
                                            </td>
                                            <td>{emailOf(member)}</td>
                                            <td>{phoneOf(member)}</td>
                                            <td>
                                                <span className={`admin-members__status admin-members__status--${approval.toLowerCase()}`}>
                                                    {approval}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={statusOf(member)}
                                                    disabled={busy || saving}
                                                    onChange={(event) =>
                                                        handleAccountStatus(member, event.target.value)
                                                    }
                                                    aria-label={`Account status for ${nameOf(member)}`}
                                                >
                                                    {ACCOUNT_STATUSES.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div className="admin-members__actions">
                                                    <button type="button" onClick={() => setViewingMember(member)}>
                                                        View
                                                    </button>
                                                    <button type="button" onClick={() => openEdit(member)}>
                                                        Edit
                                                    </button>
                                                    {!approved && (
                                                        <button
                                                            type="button"
                                                            className="admin-members__approve"
                                                            disabled={busy || saving}
                                                            onClick={() => handleApproval(member, "APPROVED")}
                                                        >
                                                            {approvalLoadingId === id ? "Updating..." : "Approve"}
                                                        </button>
                                                    )}
                                                    {approval !== "REJECTED" && (
                                                        <button
                                                            type="button"
                                                            className="admin-members__reject"
                                                            disabled={busy || saving}
                                                            onClick={() => handleApproval(member, "REJECTED")}
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

                {viewingMember && (
                    <section className="admin-members__panel">
                        <div className="admin-members__panel-header">
                            <h2>Member Details</h2>
                            <button type="button" onClick={() => setViewingMember(null)}>Close</button>
                        </div>
                        <div className="admin-members__details">
                            <Detail label="Member ID" value={memberIdOf(viewingMember)} />
                            <Detail label="User ID" value={userIdOf(viewingMember)} />
                            <Detail label="Name" value={nameOf(viewingMember)} />
                            <Detail label="Email" value={emailOf(viewingMember)} />
                            <Detail label="Phone" value={phoneOf(viewingMember)} />
                            <Detail label="Date of Birth" value={viewingMember.dateOfBirth} />
                            <Detail label="Gender" value={viewingMember.gender} />
                            <Detail label="Address" value={viewingMember.address} />
                            <Detail label="Approval" value={approvalOf(viewingMember)} />
                            <Detail label="Account Status" value={statusOf(viewingMember)} />
                        </div>
                    </section>
                )}

                {editingMember && (
                    <section className="admin-members__panel">
                        <div className="admin-members__panel-header">
                            <h2>Edit Member</h2>
                            <button type="button" onClick={() => setEditingMember(null)} disabled={saving}>
                                Close
                            </button>
                        </div>

                        <form className="admin-members__form" onSubmit={handleSave}>
                            <div className="admin-members__form-grid">
                                <Field label="First Name">
                                    <input name="firstName" value={editForm.firstName} onChange={handleEditChange} required />
                                </Field>
                                <Field label="Last Name">
                                    <input name="lastName" value={editForm.lastName} onChange={handleEditChange} required />
                                </Field>
                                <Field label="Email">
                                    <input type="email" name="email" value={editForm.email} readOnly />
                                </Field>
                                <Field label="Phone">
                                    <input name="phone" value={editForm.phone} onChange={handleEditChange} />
                                </Field>
                                <Field label="Date of Birth">
                                    <input type="date" name="dateOfBirth" value={editForm.dateOfBirth} onChange={handleEditChange} />
                                </Field>
                                <Field label="Gender">
                                    <select name="gender" value={editForm.gender} onChange={handleEditChange}>
                                        <option value="">Select gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </Field>
                                <Field label="Address" wide>
                                    <textarea name="address" rows="3" value={editForm.address} onChange={handleEditChange} />
                                </Field>
                            </div>
                            <div className="admin-members__form-actions">
                                <button type="button" onClick={() => setEditingMember(null)} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="submit" className="admin-members__primary" disabled={saving}>
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
        <div className="admin-members__detail">
            <span>{label}</span>
            <strong>{value === null || value === undefined || value === "" ? "Not provided" : value}</strong>
        </div>
    );
}

function Field({ label, wide = false, children }) {
    return (
        <label className={`admin-members__field${wide ? " admin-members__field--wide" : ""}`}>
            <span>{label}</span>
            {children}
        </label>
    );
}

export default Members;
