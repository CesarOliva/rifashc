import { Navigate, Outlet, useLocation } from "react-router";
import { isAdminAuthenticated } from "../services/auth";

const RequireAdmin = () => {
    const location = useLocation();

    if (!isAdminAuthenticated()) {
        return <Navigate to="/Admin/Login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RequireAdmin;
