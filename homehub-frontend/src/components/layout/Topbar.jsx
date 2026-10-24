
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Search,
    Sun,
    Moon,
    Bell,
    ChevronRight,
    LayoutDashboard,
    MonitorSmartphone,
    CheckSquare,
    Wallet,
    Settings,
    UserRound,
} from "lucide-react";

import "./styles/Topbar.css";
import { useTheme } from "../../contexts/ThemeContext";

const pageInfo = {
    "/": { key: "overview", icon: LayoutDashboard },
    "/devices": { key: "devices", icon: MonitorSmartphone },
    "/tasks": { key: "tasks", icon: CheckSquare },
    "/expenses": { key: "expenses", icon: Wallet },
    "/profile": { key: "profile", icon: UserRound },
    "/settings": { key: "settings", icon: Settings },
};

function getInitials(name = "") {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(-2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "U"
    );
}

export default function Topbar({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();

    const [search, setSearch] = useState("");

    const page = pageInfo[location.pathname] || {
        key: "defaultPage",
        icon: LayoutDashboard,
    };

    const PageIcon = page.icon;
    const name = user?.full_name || user?.username || t("common.user");

    function handleSearch(event) {
        event.preventDefault();

        const keyword = search.trim();
        if (!keyword) return;

        navigate(`/devices?search=${encodeURIComponent(keyword)}`);
    }

    return (
        <header className="topbar">
            <div className="topbar-heading">
                <div className="topbar-breadcrumb">
                    <span>HomeHub</span>
                    <ChevronRight size={15} />
                    <strong>{t(`pages.${page.key}`)}</strong>
                </div>

                <div className="topbar-page-title">
                    <span className="topbar-page-title__icon">
                        <PageIcon size={19} />
                    </span>
                    <h1>{t(`pages.${page.key}`)}</h1>
                </div>
            </div>

            <div className="topbar-actions">
                <form className="topbar-search" onSubmit={handleSearch}>
                    <Search size={18} />

                    <input
                        type="search"
                        placeholder={t("topbar.searchPlaceholder")}
                        aria-label={t("topbar.searchLabel")}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <kbd>Enter</kbd>
                </form>

                <div className="topbar-divider" />

                <button
                    type="button"
                    className="topbar-icon-button"
                    onClick={toggleTheme}
                    aria-label={
                        theme === "dark"
                            ? t("topbar.switchToLight")
                            : t("topbar.switchToDark")
                    }
                    title={
                        theme === "dark"
                            ? t("topbar.lightTheme")
                            : t("topbar.darkTheme")
                    }
                >
                    {theme === "dark" ? (
                        <Sun size={19} />
                    ) : (
                        <Moon size={19} />
                    )}
                </button>

                <button
                    type="button"
                    className="topbar-icon-button topbar-notification"
                    aria-label={t("common.notifications")}
                    title={t("common.notifications")}
                >
                    <Bell size={19} />
                    <span className="topbar-notification__dot" />
                </button>

                <div className="topbar-divider topbar-divider--user" />

                <button
                    type="button"
                    className="topbar-user"
                    onClick={() => navigate("/profile")}
                    title={t("topbar.accountInfo")}
                >
                    <span className="topbar-user__avatar">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={name} />
                        ) : (
                            getInitials(name)
                        )}
                    </span>

                    <span className="topbar-user__info">
                        <strong>{name}</strong>
                        <small>
                            {user?.is_superuser === true
                                ? t("common.admin")
                                : t("common.member")}
                        </small>
                    </span>

                    <UserRound
                        className="topbar-user__profile-icon"
                        size={16}
                    />
                </button>
            </div>
        </header>
    );
}