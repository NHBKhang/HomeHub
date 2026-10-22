
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    House,
    LayoutDashboard,
    MonitorSmartphone,
    CheckSquare,
    Wallet,
    Settings,
    LogOut,
    ChevronUp,
    UserRound,
} from "lucide-react";

import "./styles/Sidebar.css";

const menuItems = [
    { label: "overview", path: "/", icon: LayoutDashboard, end: true },
    { label: "devices", path: "/devices", icon: MonitorSmartphone },
    { label: "tasks", path: "/tasks", icon: CheckSquare },
    { label: "expenses", path: "/expenses", icon: Wallet },
];

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

export default function Sidebar({ user, loading, onLogout }) {
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const { t } = useTranslation();

    const name = user?.full_name || user?.username || t("sidebar.user");
    const avatar = user?.avatar_url;
    const role = user?.is_superuser === true
        ? t("sidebar.admin")
        : t("sidebar.member");

    return (
        <aside className="sidebar">
            <NavLink to="/" className="sidebar-brand">
                <span className="sidebar-brand__icon">
                    <House size={21} strokeWidth={2.3} />
                </span>

                <span className="sidebar-brand__text">
                    Home<span>Hub</span>
                    <small>{t("sidebar.brandSubtitle")}</small>
                </span>
            </NavLink>

            <div className="sidebar-section">
                <p className="sidebar-section__label">
                    {t("sidebar.workspace")}
                </p>

                <nav className="sidebar-nav">
                    {menuItems.map(({ label, path, icon: Icon, end }) => (
                        <NavLink
                            key={path}
                            to={path}
                            end={end}
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? " is-active" : ""}`
                            }
                        >
                            <span className="sidebar-link__icon">
                                <Icon size={19} strokeWidth={1.9} />
                            </span>

                            <span className="sidebar-link__label">
                                {t(`sidebar.${label}`)}
                            </span>

                            <span className="sidebar-link__indicator" />
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-section sidebar-section--settings">
                <p className="sidebar-section__label">
                    {t("sidebar.system")}
                </p>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `sidebar-link${isActive ? " is-active" : ""}`
                    }
                >
                    <span className="sidebar-link__icon">
                        <UserRound size={19} strokeWidth={1.9} />
                    </span>
                    <span className="sidebar-link__label">
                        {t("sidebar.profile")}
                    </span>
                    <span className="sidebar-link__indicator" />
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `sidebar-link${isActive ? " is-active" : ""}`
                    }
                >
                    <span className="sidebar-link__icon">
                        <Settings size={19} strokeWidth={1.9} />
                    </span>
                    <span className="sidebar-link__label">
                        {t("sidebar.settings")}
                    </span>
                    <span className="sidebar-link__indicator" />
                </NavLink>
            </div>

            <div className="sidebar-bottom">
                <div className="sidebar-status">
                    <span className="sidebar-status__dot" />
                    <span>{t("sidebar.activeStatus")}</span>
                </div>

                <div className="account-wrap">
                    {accountMenuOpen && (
                        <div className="account-menu">
                            <NavLink
                                to="/profile"
                                className="account-menu__item"
                                onClick={() => setAccountMenuOpen(false)}
                            >
                                <UserRound size={17} />
                                {t("sidebar.profile")}
                            </NavLink>

                            <button
                                type="button"
                                className="account-menu__item account-menu__item--danger"
                                onClick={onLogout}
                            >
                                <LogOut size={17} />
                                {t("sidebar.logout")}
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="account-card"
                        onClick={() => setAccountMenuOpen((open) => !open)}
                        aria-expanded={accountMenuOpen}
                    >
                        <span className="user-avatar">
                            {avatar ? (
                                <img src={avatar} alt={name} />
                            ) : (
                                getInitials(name)
                            )}
                            <span className="user-avatar__online" />
                        </span>

                        <span className="account-card__info">
                            <strong>
                                {loading
                                    ? t("sidebar.loading")
                                    : name}
                            </strong>
                            <small>
                                {loading
                                    ? t("sidebar.connecting")
                                    : role}
                            </small>
                        </span>

                        <ChevronUp
                            className={`account-card__chevron${accountMenuOpen ? " is-open" : ""}`}
                            size={17}
                        />
                    </button>
                </div>
            </div>
        </aside>
    );
}