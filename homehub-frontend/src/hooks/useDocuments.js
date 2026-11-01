import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckSquare, LayoutDashboard, MonitorSmartphone, Settings, UserRound, Users, Wallet } from "lucide-react";


export const pageInfo = {
    "/": { key: "overview", icon: LayoutDashboard },
    "/devices": { key: "devices", icon: MonitorSmartphone },
    "/tasks": { key: "tasks", icon: CheckSquare },
    "/expenses": { key: "expenses", icon: Wallet },
    "/profile": { key: "profile", icon: UserRound },
    "/settings": { key: "settings", icon: Settings },
    "/users": { key: "users", icon: Users },
    "/login": { key: "login" },
    "/register": { key: "register" },
};

export default function useDocumentTitle() {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const titleKey = pageInfo[pathname].key;
        const pageTitle = titleKey
            ? t(`pages.${titleKey}`)
            : t("pages.notFound");

        document.title = `${pageTitle} | HomeHub`;
    }, [pathname, t, i18n.language]);
}