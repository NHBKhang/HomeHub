import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import AppLayout from "../../components/layout/AppLayout";

export default function RequireAuth() {
    const { user, userLoading } = useUser();
    const location = useLocation();

    if (userLoading) {
        return (
            <div className="auth-loading">
                <span className="auth-loading__spinner" />
                <p>Đang kiểm tra tài khoản...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <AppLayout />;
}