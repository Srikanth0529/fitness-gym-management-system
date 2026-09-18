import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Card from "../../components/common/Card/Card";
import Button from "../../components/common/Button/Button";
import FormField from "../../components/form/FormField/FormField";
import Input from "../../components/form/Input/Input";
import PasswordInput from "../../components/form/PasswordInput/PasswordInput";
import Select from "../../components/form/Select/Select";
import Textarea from "../../components/form/Textarea/Textarea";
import Alert from "../../components/feedback/Alert/Alert";

import { registerUser } from "../../services/auth/authService";

import "./RegisterPage.css";

const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(
            100,
            "First name cannot exceed 100 characters"
        ),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(
            100,
            "Last name cannot exceed 100 characters"
        ),

    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(
            100,
            "Password cannot exceed 100 characters"
        ),

    phone: z
        .string()
        .trim()
        .max(
            20,
            "Phone cannot exceed 20 characters"
        )
        .optional()
        .or(z.literal("")),

    dateOfBirth: z
        .string()
        .optional()
        .or(z.literal("")),

    gender: z
        .string()
        .max(
            20,
            "Gender cannot exceed 20 characters"
        )
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(
            500,
            "Address cannot exceed 500 characters"
        )
        .optional()
        .or(z.literal("")),
});

const genderOptions = [
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
];

function RegisterPage() {
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] =
        useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (formData) => {
        setServerError("");
        setSuccessMessage("");

        try {
            await registerUser(formData);

            setSuccessMessage(
                "Registration successful. Your account is waiting for admin approval."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to complete registration. Please try again.";

            setServerError(message);
        }
    };

    return (
        <div className="register-page">
            <Card
                title="Create your account"
                subtitle="Register as a member and start your fitness journey."
                padding="large"
            >
                {serverError && (
                    <div className="register-page__alert">
                        <Alert type="error">
                            {serverError}
                        </Alert>
                    </div>
                )}

                {successMessage && (
                    <div className="register-page__alert">
                        <Alert type="success">
                            {successMessage}
                        </Alert>
                    </div>
                )}

                <form
                    className="register-page__form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <div className="register-page__row">
                        <FormField
                            label="First Name"
                            htmlFor="firstName"
                            required
                            error={
                                errors.firstName?.message
                            }
                        >
                            <Input
                                id="firstName"
                                placeholder="Enter first name"
                                autoComplete="given-name"
                                aria-invalid={
                                    errors.firstName
                                        ? "true"
                                        : "false"
                                }
                                {...register("firstName")}
                            />
                        </FormField>

                        <FormField
                            label="Last Name"
                            htmlFor="lastName"
                            required
                            error={
                                errors.lastName?.message
                            }
                        >
                            <Input
                                id="lastName"
                                placeholder="Enter last name"
                                autoComplete="family-name"
                                aria-invalid={
                                    errors.lastName
                                        ? "true"
                                        : "false"
                                }
                                {...register("lastName")}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Email"
                        htmlFor="email"
                        required
                        error={errors.email?.message}
                    >
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            aria-invalid={
                                errors.email
                                    ? "true"
                                    : "false"
                            }
                            {...register("email")}
                        />
                    </FormField>

                    <FormField
                        label="Password"
                        htmlFor="password"
                        required
                        hint="Password must contain at least 8 characters."
                        error={errors.password?.message}
                    >
                        <PasswordInput
                            id="password"
                            placeholder="Create a password"
                            autoComplete="new-password"
                            aria-invalid={
                                errors.password
                                    ? "true"
                                    : "false"
                            }
                            {...register("password")}
                        />
                    </FormField>

                    <FormField
                        label="Phone"
                        htmlFor="phone"
                        error={errors.phone?.message}
                    >
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            autoComplete="tel"
                            aria-invalid={
                                errors.phone
                                    ? "true"
                                    : "false"
                            }
                            {...register("phone")}
                        />
                    </FormField>

                    <div className="register-page__row">
                        <FormField
                            label="Date of Birth"
                            htmlFor="dateOfBirth"
                            error={
                                errors.dateOfBirth?.message
                            }
                        >
                            <Input
                                id="dateOfBirth"
                                type="date"
                                {...register(
                                    "dateOfBirth"
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Gender"
                            htmlFor="gender"
                            error={
                                errors.gender?.message
                            }
                        >
                            <Select
                                id="gender"
                                options={genderOptions}
                                placeholder="Select gender"
                                {...register("gender")}
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Address"
                        htmlFor="address"
                        error={errors.address?.message}
                    >
                        <Textarea
                            id="address"
                            rows={4}
                            placeholder="Enter your address"
                            {...register("address")}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        size="large"
                        fullWidth
                        loading={isSubmitting}
                    >
                        Create Account
                    </Button>
                </form>

                <div className="register-page__footer">
                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Sign in
                    </Link>
                </div>
            </Card>
        </div>
    );
}

export default RegisterPage;