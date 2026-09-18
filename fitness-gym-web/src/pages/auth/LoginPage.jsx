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
import Alert from "../../components/feedback/Alert/Alert";

import useAuth from "../../hooks/useAuth";

import "./LoginPage.css";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required"),
});

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const onSubmit = async (formData) => {
        setServerError("");

        try {
            const response = await login(formData);

            const loggedInUser = response.data;

            if (loggedInUser.role === "ADMIN") {
                navigate("/admin/dashboard", {
                    replace: true,
                });

                return;
            }

            if (loggedInUser.role === "TRAINER") {
                navigate("/trainer/dashboard", {
                    replace: true,
                });

                return;
            }

            navigate("/member/profile", {
                replace: true,
            });
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to login. Please check your credentials and try again.";

            setServerError(message);
        }
    };

    return (
        <div className="login-page">
            <Card
                title="Welcome back"
                subtitle="Sign in to access your fitness account."
                padding="large"
            >
                {serverError && (
                    <div className="login-page__alert">
                        <Alert type="error">
                            {serverError}
                        </Alert>
                    </div>
                )}

                <form
                    className="login-page__form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
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
                        error={errors.password?.message}
                    >
                        <PasswordInput
                            id="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            aria-invalid={
                                errors.password
                                    ? "true"
                                    : "false"
                            }
                            {...register("password")}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        size="large"
                        fullWidth
                        loading={isSubmitting}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="login-page__footer">
                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create an account
                    </Link>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;