import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import AppLayout from "../layouts/AppLayout/AppLayout";
import ProfilePage from "../pages/member/ProfilePage/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function Placeholder({ title }) {
    return (
        <section>
            <h1>{title}</h1>

            <p
                style={{
                    marginTop: "var(--spacing-4)",
                }}
            >
                This page will be implemented in a
                later development part.
            </p>
        </section>
    );
}

function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/register"
                        element={<RegisterPage />}
                    />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route
                        path="/dashboard"
                        element={
                            <Placeholder
                                title="Dashboard"
                            />
                        }
                    />

                    {/* Member */}
                    <Route element={
                        <RoleRoute
                            allowedRoles={["MEMBER"]}
                        />
                    }>
                        <Route
                            path="/member/profile"
                            element={<ProfilePage />
                            }
                        />
                    </Route>

                    {/* Trainer */}
                    <Route element={
                        <RoleRoute
                            allowedRoles={["TRAINER"]}
                        />
                    }>
                        <Route
                            path="/trainer/dashboard"
                            element={
                                <Placeholder
                                    title="Trainer Dashboard"
                                />
                            }
                        />
                    </Route>

                    {/* Admin */}
                    <Route element={
                        <RoleRoute
                            allowedRoles={["ADMIN"]}
                        />
                    }>
                        <Route
                            path="/admin/dashboard"
                            element={
                                <Placeholder
                                    title="Admin Dashboard"
                                />
                            }
                        />
                    </Route>

                    <Route
                        path="/unauthorized"
                        element={
                            <Placeholder
                                title="Unauthorized"
                            />
                        }
                    />
                </Route>
            </Route>

            {/* Default */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* Unknown route */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default AppRouter;