import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { profileSchema } from "../../../validation/member/profileSchema";
import {
    getMemberProfile,
    updateMemberProfile,
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

function ProfilePage() {
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            address: "",
        },
    });

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.memberId) {
                setError("Member profile information is unavailable.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await getMemberProfile(
                    user.memberId
                );

                const data = response?.data ?? response;

                setProfile(data);

                reset({
                    firstName: data?.firstName ?? "",
                    lastName: data?.lastName ?? "",
                    phone: data?.phone ?? "",
                    dateOfBirth: data?.dateOfBirth ?? "",
                    gender: data?.gender ?? "",
                    address: data?.address ?? "",
                });
            } catch (exception) {
                setError(
                    exception?.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user?.memberId, reset]);

    const handleEdit = () => {
        setSuccess("");
        setError("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (profile) {
            reset({
                firstName: profile.firstName ?? "",
                lastName: profile.lastName ?? "",
                phone: profile.phone ?? "",
                dateOfBirth: profile.dateOfBirth ?? "",
                gender: profile.gender ?? "",
                address: profile.address ?? "",
            });
        }

        setError("");
        setSuccess("");
        setIsEditing(false);
    };

    const onSubmit = async (formData) => {
        if (!user?.memberId) {
            setError("Member profile information is unavailable.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await updateMemberProfile(
                user.memberId,
                formData
            );

            const updatedProfile =
                response?.data ?? response;

            setProfile(updatedProfile);

            reset({
                firstName: updatedProfile?.firstName ?? "",
                lastName: updatedProfile?.lastName ?? "",
                phone: updatedProfile?.phone ?? "",
                dateOfBirth:
                    updatedProfile?.dateOfBirth ?? "",
                gender: updatedProfile?.gender ?? "",
                address: updatedProfile?.address ?? "",
            });

            setIsEditing(false);
            setSuccess(
                "Your profile has been updated successfully."
            );
        } catch (exception) {
            setError(
                exception?.response?.data?.message ||
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

    return (
        <section className="profile-page">
            <div className="profile-page__header">
                <div>
                    <h1 className="profile-page__title">
                        Member Profile
                    </h1>

                    <p className="profile-page__subtitle">
                        View and manage your personal information.
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
                                >
                                    <Input
                                        type="email"
                                        value={
                                            profile?.email ?? ""
                                        }
                                        disabled
                                        readOnly
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
                                        {...register("gender")}
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
                                            {...register("address")}
                                        />
                                    </FormField>
                                </div>
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
                                    Your registered member information.
                                </p>
                            </div>

                            <div className="profile-details__grid">
                                <ProfileDetail
                                    label="First Name"
                                    value={profile?.firstName}
                                />

                                <ProfileDetail
                                    label="Last Name"
                                    value={profile?.lastName}
                                />

                                <ProfileDetail
                                    label="Email"
                                    value={profile?.email}
                                />

                                <ProfileDetail
                                    label="Phone"
                                    value={profile?.phone}
                                />

                                <ProfileDetail
                                    label="Date of Birth"
                                    value={profile?.dateOfBirth}
                                />

                                <ProfileDetail
                                    label="Gender"
                                    value={profile?.gender}
                                />

                                <div className="profile-details__full-width">
                                    <ProfileDetail
                                        label="Address"
                                        value={profile?.address}
                                    />
                                </div>
                            </div>
                        </div>

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