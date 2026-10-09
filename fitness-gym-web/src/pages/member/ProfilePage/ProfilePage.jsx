import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    getMemberProfile,
    updateMemberProfile,
    getTrainerProfile,
    updateTrainerProfile,
    getUserProfile,
    updateUserProfile,
} from "../../../services/member/memberService";

import useAuth from "../../../hooks/useAuth";

import Card from "../../../components/common/Card/Card";
import Button from "../../../components/common/Button/Button";
import FormField from "../../../components/form/FormField/FormField";
import Input from "../../../components/form/Input/Input";
import Select from "../../../components/form/Select/Select";
import Textarea from "../../../components/form/Textarea/Textarea";
import Alert from "../../../components/feedback/Alert/Alert";
import Loader from "../../../components/feedback/Loader/Loader";

import "./ProfilePage.css";

const memberSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(100, "First name cannot exceed 100 characters"),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(100, "Last name cannot exceed 100 characters"),

    phone: z
        .string()
        .trim()
        .max(20, "Phone cannot exceed 20 characters")
        .optional()
        .or(z.literal("")),

    dateOfBirth: z
        .string()
        .optional()
        .or(z.literal("")),

    gender: z
        .string()
        .max(20, "Gender cannot exceed 20 characters")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(500, "Address cannot exceed 500 characters")
        .optional()
        .or(z.literal("")),
});

const userSchema = z.object({
    firstName: z
        .string()
        .max(100, "First name cannot exceed 100 characters"),

    lastName: z
        .string()
        .max(100, "Last name cannot exceed 100 characters"),

    email: z
        .string()
        .email("Invalid email address")
        .max(150, "Email cannot exceed 150 characters"),

    phone: z
        .string()
        .max(20, "Phone cannot exceed 20 characters")
        .optional()
        .or(z.literal("")),
});

function ProfilePage() {
    const { user } = useAuth();

    const role = user?.role;

    const isMember = role === "MEMBER";
    const isTrainer = role === "TRAINER";
    const isAdmin = role === "ADMIN";

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const schema = isMember
        ? memberSchema
        : userSchema;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            address: "",
        },
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) {
                setError(
                    "Authenticated user information is unavailable."
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                let response;

                if (isMember) {
                    if (!user.memberId) {
                        throw new Error(
                            "Member profile information is unavailable."
                        );
                    }

                    response = await getMemberProfile(
                        user.memberId
                    );
                } else if (isTrainer) {
                    if (!user.trainerId) {
                        throw new Error(
                            "Trainer profile information is unavailable. Please login again after trainer profile access is configured."
                        );
                    }

                    response = await getTrainerProfile(
                        user.trainerId
                    );
                } else if (isAdmin) {
                    if (!user.userId) {
                        throw new Error(
                            "User profile information is unavailable."
                        );
                    }

                    response = await getUserProfile(
                        user.userId
                    );
                } else {
                    throw new Error(
                        "Unsupported user role."
                    );
                }

                const data =
                    response?.data ?? response;

                setProfile(data);

                reset({
                    firstName:
                        data?.firstName ?? "",
                    lastName:
                        data?.lastName ?? "",
                    email:
                        data?.email ??
                        user?.email ??
                        "",
                    phone:
                        data?.phone ?? "",
                    dateOfBirth:
                        data?.dateOfBirth ?? "",
                    gender:
                        data?.gender ?? "",
                    address:
                        data?.address ?? "",
                });
            } catch (exception) {
                setError(
                    exception?.response?.data?.message ||
                    exception?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [
        user,
        isMember,
        isTrainer,
        isAdmin,
        reset,
    ]);

    const handleEdit = () => {
        setSuccess("");
        setError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (profile) {
            reset({
                firstName:
                    profile.firstName ?? "",
                lastName:
                    profile.lastName ?? "",
                email:
                    profile.email ??
                    user?.email ??
                    "",
                phone:
                    profile.phone ?? "",
                dateOfBirth:
                    profile.dateOfBirth ?? "",
                gender:
                    profile.gender ?? "",
                address:
                    profile.address ?? "",
            });
        }

        setError("");
        setSuccess("");
        setIsEditing(false);
    };

    const onSubmit = async (formData) => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            let response;

            if (isMember) {
                if (!user?.memberId) {
                    throw new Error(
                        "Member profile information is unavailable."
                    );
                }

                response =
                    await updateMemberProfile(
                        user.memberId,
                        formData
                    );
            } else if (isTrainer) {
                if (!user?.trainerId) {
                    throw new Error(
                        "Trainer profile information is unavailable."
                    );
                }

                const trainerFormData = {
                    ...formData,
                    specialization:
                        profile?.specialization ?? "",
                    experienceYears:
                        profile?.experienceYears ?? null,
                    bio:
                        profile?.bio ?? "",
                };

                response =
                    await updateTrainerProfile(
                        user.trainerId,
                        trainerFormData
                    );
            } else if (isAdmin) {
                if (!user?.userId) {
                    throw new Error(
                        "User profile information is unavailable."
                    );
                }

                response =
                    await updateUserProfile(
                        user.userId,
                        formData
                    );
            } else {
                throw new Error(
                    "Unsupported user role."
                );
            }

            const updatedProfile =
                response?.data ?? response;

            setProfile(updatedProfile);

            reset({
                firstName:
                    updatedProfile?.firstName ?? "",
                lastName:
                    updatedProfile?.lastName ?? "",
                email:
                    updatedProfile?.email ??
                    user?.email ??
                    "",
                phone:
                    updatedProfile?.phone ?? "",
                dateOfBirth:
                    updatedProfile?.dateOfBirth ?? "",
                gender:
                    updatedProfile?.gender ?? "",
                address:
                    updatedProfile?.address ?? "",
            });

            setIsEditing(false);

            setSuccess(
                "Your profile has been updated successfully."
            );
        } catch (exception) {
            setError(
                exception?.response?.data?.message ||
                exception?.message ||
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-page__loading">
                <Loader />
            </div>
        );
    }

    const pageTitle =
        isMember
            ? "Member Profile"
            : isTrainer
                ? "Trainer Profile"
                : "Admin Profile";

    const pageDescription =
        "View and manage your personal information.";

    return (
        <section className="profile-page">
            <div className="profile-page__header">
                <div>
                    <h1 className="profile-page__title">
                        {pageTitle}
                    </h1>

                    <p className="profile-page__subtitle">
                        {pageDescription}
                    </p>
                </div>

                {!isEditing && (
                    <Button
                        type="button"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>

            {success && (
                <div className="profile-page__feedback">
                    <Alert
                        type="success"
                        message={success}
                    />
                </div>
            )}

            {error && (
                <div className="profile-page__feedback">
                    <Alert
                        type="error"
                        message={error}
                    />
                </div>
            )}

            <Card>
                {isEditing ? (
                    <form
                        className="profile-form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <div className="profile-form__section">
                            <div className="profile-form__section-header">
                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Update your personal details.
                                </p>
                            </div>

                            <div className="profile-form__grid">
                                <FormField
                                    label="First Name"
                                    required
                                    error={
                                        errors.firstName?.message
                                    }
                                >
                                    <Input
                                        type="text"
                                        {...register("firstName")}
                                    />
                                </FormField>

                                <FormField
                                    label="Last Name"
                                    required
                                    error={
                                        errors.lastName?.message
                                    }
                                >
                                    <Input
                                        type="text"
                                        {...register("lastName")}
                                    />
                                </FormField>

                                <FormField
                                    label="Email"
                                    required={!isMember}
                                    error={
                                        errors.email?.message
                                    }
                                >
                                    <Input
                                        type="email"
                                        {...register("email")}
                                        disabled={isMember}
                                        readOnly={isMember}
                                    />
                                </FormField>

                                <FormField
                                    label="Phone"
                                    error={
                                        errors.phone?.message
                                    }
                                >
                                    <Input
                                        type="text"
                                        {...register("phone")}
                                    />
                                </FormField>

                                {isMember && (
                                    <>
                                        <FormField
                                            label="Date of Birth"
                                            error={
                                                errors.dateOfBirth?.message
                                            }
                                        >
                                            <Input
                                                type="date"
                                                {...register(
                                                    "dateOfBirth"
                                                )}
                                            />
                                        </FormField>

                                        <FormField
                                            label="Gender"
                                            error={
                                                errors.gender?.message
                                            }
                                        >
                                            <Select
                                                {...register(
                                                    "gender"
                                                )}
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "Select gender",
                                                    },
                                                    {
                                                        value: "MALE",
                                                        label: "Male",
                                                    },
                                                    {
                                                        value: "FEMALE",
                                                        label: "Female",
                                                    },
                                                    {
                                                        value: "OTHER",
                                                        label: "Other",
                                                    },
                                                ]}
                                            />
                                        </FormField>

                                        <div className="profile-form__full-width">
                                            <FormField
                                                label="Address"
                                                error={
                                                    errors.address?.message
                                                }
                                            >
                                                <Textarea
                                                    rows={4}
                                                    {...register(
                                                        "address"
                                                    )}
                                                />
                                            </FormField>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="profile-form__actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-details">
                        <div className="profile-details__section">
                            <div className="profile-details__section-header">
                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Your registered account information.
                                </p>
                            </div>

                            <div className="profile-details__grid">
                                <ProfileDetail
                                    label="First Name"
                                    value={
                                        profile?.firstName
                                    }
                                />

                                <ProfileDetail
                                    label="Last Name"
                                    value={
                                        profile?.lastName
                                    }
                                />

                                <ProfileDetail
                                    label="Email"
                                    value={
                                        profile?.email
                                    }
                                />

                                <ProfileDetail
                                    label="Phone"
                                    value={
                                        profile?.phone
                                    }
                                />

                                {isMember && (
                                    <>
                                        <ProfileDetail
                                            label="Date of Birth"
                                            value={
                                                profile?.dateOfBirth
                                            }
                                        />

                                        <ProfileDetail
                                            label="Gender"
                                            value={
                                                profile?.gender
                                            }
                                        />

                                        <div className="profile-details__full-width">
                                            <ProfileDetail
                                                label="Address"
                                                value={
                                                    profile?.address
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {isTrainer && (
                                    <>
                                        <ProfileDetail
                                            label="Specialization"
                                            value={
                                                profile?.specialization
                                            }
                                        />

                                        <ProfileDetail
                                            label="Experience"
                                            value={
                                                profile?.experienceYears != null
                                                    ? `${profile.experienceYears} years`
                                                    : null
                                            }
                                        />

                                        <div className="profile-details__full-width">
                                            <ProfileDetail
                                                label="Bio"
                                                value={
                                                    profile?.bio
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <ProfileDetail
                                            label="Role"
                                            value={
                                                profile?.role?.roleName ??
                                                user?.role
                                            }
                                        />

                                        <ProfileDetail
                                            label="Account Status"
                                            value={
                                                profile?.accountStatus ??
                                                user?.accountStatus
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {isMember && (
                            <div className="profile-status">
                                <div>
                                    <span className="profile-status__label">
                                        Approval Status
                                    </span>

                                    <span
                                        className={`profile-status__value profile-status__value--${String(
                                            profile?.approvalStatus ?? ""
                                        ).toLowerCase()}`}
                                    >
                                        {profile?.approvalStatus ??
                                            "N/A"}
                                    </span>
                                </div>

                                <div>
                                    <span className="profile-status__label">
                                        Join Date
                                    </span>

                                    <span className="profile-status__date">
                                        {profile?.joinDate ??
                                            "N/A"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {isTrainer && (
                            <div className="profile-status">
                                <div>
                                    <span className="profile-status__label">
                                        Approval Status
                                    </span>

                                    <span
                                        className={`profile-status__value profile-status__value--${String(
                                            profile?.approvalStatus ?? ""
                                        ).toLowerCase()}`}
                                    >
                                        {profile?.approvalStatus ??
                                            "N/A"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </section>
    );
}

function ProfileDetail({ label, value }) {
    return (
        <div className="profile-detail">
            <span className="profile-detail__label">
                {label}
            </span>

            <span className="profile-detail__value">
                {value || "Not provided"}
            </span>
        </div>
    );
}

export default ProfilePage;