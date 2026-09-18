import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function RoleRoute({ allowedRoles = [] }) {
    const { user } = useAuth();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const hasPermission = allowedRoles.includes(
        user.role
    );

    if (!hasPermission) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RoleRoute;