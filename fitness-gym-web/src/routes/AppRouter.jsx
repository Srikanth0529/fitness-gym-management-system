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
import MemberBookings from "../pages/member/Bookings/Bookings";

import CreateClass from "../pages/admin/CreateClass/CreateClass";

import AdminBookings from "../pages/admin/Bookings/Bookings";

import TrainerBookings from "../pages/trainer/Bookings/Bookings";

import AdminMembers from "../pages/admin/Members/Members";
import AdminTrainers from "../pages/admin/Trainers/Trainers";

import TrainerClients from "../pages/trainer/Clients/Clients";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";


function Placeholder({
    title,
}) {

    return (

        <section>

            <h1>
                {title}
            </h1>

            <p
                style={{
                    marginTop:
                        "var(--spacing-4)",
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

            {/* =====================================================
                PUBLIC ROUTES
            ====================================================== */}

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


            {/* =====================================================
                PROTECTED ROUTES
            ====================================================== */}

            <Route element={<ProtectedRoute />}>

                <Route element={<AppLayout />}>

                    {/* =================================================
                        COMMON DASHBOARD
                    ================================================== */}

                    <Route
                        path="/dashboard"
                        element={
                            <Placeholder
                                title="Dashboard"
                            />
                        }
                    />


                    {/* =================================================
                        MEMBER ROUTES
                    ================================================== */}

                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "MEMBER",
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/member/profile"
                            element={
                                <ProfilePage />
                            }
                        />

                        <Route
                            path="/member/membership-plans"
                            element={
                                <MembershipPlans />
                            }
                        />

                        <Route
                            path="/member/subscribe"
                            element={
                                <SubscribeMembership />
                            }
                        />

                        <Route
                            path="/member/membership"
                            element={
                                <CurrentMembership />
                            }
                        />

                        <Route
                            path="/member/classes"
                            element={
                                <Classes />
                            }
                        />

                        <Route
                            path="/member/bookings"
                            element={
                                <MemberBookings />
                            }
                        />

                    </Route>


                    {/* =================================================
                        TRAINER ROUTES
                    ================================================== */}

                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "TRAINER",
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/trainer/profile"
                            element={
                                <ProfilePage />
                            }
                        />

                        <Route
                            path="/trainer/dashboard"
                            element={
                                <Placeholder
                                    title="Trainer Dashboard"
                                />
                            }
                        />

                        <Route
                            path="/trainer/classes"
                            element={
                                <CreateClass />
                            }
                        />

                        <Route
                            path="/trainer/classes/create"
                            element={
                                <CreateClass />
                            }
                        />

                        <Route
                            path="/trainer/clients"
                            element={
                                <TrainerClients />
                            }
                        />

                        <Route
                            path="/trainer/bookings"
                            element={
                                <TrainerBookings />
                            }
                        />

                    </Route>


                    {/* =================================================
                        ADMIN ROUTES
                    ================================================== */}

                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "ADMIN",
                                ]}
                            />
                        }
                    >

                        <Route
                            path="/admin/profile"
                            element={
                                <ProfilePage />
                            }
                        />

                        <Route
                            path="/admin/dashboard"
                            element={
                                <Placeholder
                                    title="Admin Dashboard"
                                />
                            }
                        />

                        <Route
                            path="/admin/members"
                            element={
                                <AdminMembers />
                            }
                        />

                        <Route
                            path="/admin/trainers"
                            element={
                                <AdminTrainers />
                            }
                        />

                        <Route
                            path="/admin/classes"
                            element={
                                <CreateClass />
                            }
                        />

                        <Route
                            path="/admin/classes/create"
                            element={
                                <CreateClass />
                            }
                        />

                        <Route
                            path="/admin/bookings"
                            element={
                                <AdminBookings />
                            }
                        />

                    </Route>


                    {/* =================================================
                        UNAUTHORIZED
                    ================================================== */}

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


            {/* =====================================================
                DEFAULT ROUTE
            ====================================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />


            {/* =====================================================
                UNKNOWN ROUTE
            ====================================================== */}

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