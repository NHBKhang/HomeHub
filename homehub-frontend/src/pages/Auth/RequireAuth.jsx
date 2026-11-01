
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useTranslation } from "react-i18next";
import AppLayout from "../../components/layout/AppLayout";

export default function RequireAuth({ requiredRole }) {
    const { user, userLoading } = useUser();
    const location = useLocation();
    const { t } = useTranslation();

    if (userLoading) {
        return (
            <div className="auth-loading">
                <span className="auth-loading__spinner" />
                <p>{t("common.requireAuth")}</p>
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

    if (requiredRole && user.is_superuser !== Boolean(requiredRole)) {
        return <Navigate to="*" replace />;
    }

    return <AppLayout />;
}
