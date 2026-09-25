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
import MembershipPlans from "../pages/member/MembershipPlans/MembershipPlans";
import SubscribeMembership from "../pages/member/SubscribeMembership/SubscribeMembership";
import CurrentMembership from "../pages/member/CurrentMembership/CurrentMembership";
import Classes from "../pages/member/Classes/Classes";

import CreateClass from "../pages/admin/CreateClass/CreateClass";

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

                    {/* Common Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <Placeholder
                                title="Dashboard"
                            />
                        }
                    />

                    {/* =========================
                        MEMBER ROUTES
                    ========================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={["MEMBER"]}
                            />
                        }
                    >
                        <Route
                            path="/member/profile"
                            element={<ProfilePage />}
                        />

                        <Route
                            path="/member/membership-plans"
                            element={<MembershipPlans />}
                        />

                        <Route
                            path="/member/subscribe"
                            element={<SubscribeMembership />}
                        />

                        <Route
                            path="/member/membership"
                            element={<CurrentMembership />}
                        />

                        <Route
                            path="/member/classes"
                            element={<Classes />}
                        />
                    </Route>

                    {/* =========================
                        TRAINER ROUTES
                    ========================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={["TRAINER"]}
                            />
                        }
                    >
                        <Route
                            path="/trainer/dashboard"
                            element={
                                <Placeholder
                                    title="Trainer Dashboard"
                                />
                            }
                        />

                        {/* Sprint 2 - Create Class */}
                        <Route
                            path="/trainer/classes"
                            element={<CreateClass />}
                        />

                        {/* Optional direct create URL */}
                        <Route
                            path="/trainer/classes/create"
                            element={<CreateClass />}
                        />
                    </Route>

                    {/* =========================
                        ADMIN ROUTES
                    ========================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={["ADMIN"]}
                            />
                        }
                    >
                        <Route
                            path="/admin/dashboard"
                            element={
                                <Placeholder
                                    title="Admin Dashboard"
                                />
                            }
                        />

                        {/* Sprint 2 - Create Class */}
                        <Route
                            path="/admin/classes"
                            element={<CreateClass />}
                        />

                        {/* Direct create URL */}
                        <Route
                            path="/admin/classes/create"
                            element={<CreateClass />}
                        />
                    </Route>

                    {/* Unauthorized */}
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

            {/* Default Route */}
            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            {/* Unknown Route */}
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