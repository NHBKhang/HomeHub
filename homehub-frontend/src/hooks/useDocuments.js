import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function useDocumentTitle() {
    const { pathname } = useLocation();
    const { t, i18n } = useTranslation();

    const pageTitles = {
        "/": "pages.overview",
        "/devices": "pages.devices",
        "/tasks": "pages.tasks",
        "/expenses": "pages.expenses",
        "/profile": "pages.profile",
        "/settings": "pages.settings",
        "/login": "pages.login",
        "/register": "pages.register",
    };

    useEffect(() => {
        const titleKey = pageTitles[pathname];
        const pageTitle = titleKey
            ? t(titleKey)
            : t("pages.notFound");

        document.title = `${pageTitle} | HomeHub`;
    }, [pathname, t, i18n.language]);
}