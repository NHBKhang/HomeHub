import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const pageInfo = {
    "/": { title: "Tổng quan", icon: LayoutDashboard },
    "/devices": { title: "Thiết bị", icon: MonitorSmartphone },
    "/tasks": { title: "Công việc", icon: CheckSquare },
    "/expenses": { title: "Chi tiêu", icon: Wallet },
    "/settings": { title: "Cài đặt", icon: Settings },
};

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "U";
}

export default function Topbar({ user, theme, onToggleTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const page = pageInfo[location.pathname] || {
        title: "Trang",
        icon: LayoutDashboard,
    };

    const PageIcon = page.icon;
    const name = user?.full_name || user?.username || "Người dùng";

    function handleSearch(event) {
        event.preventDefault();

        const keyword = search.trim();
        if (!keyword) return;

        // Đưa từ khóa vào URL để trang cần tìm kiếm có thể xử lý.
        navigate(`/devices?search=${encodeURIComponent(keyword)}`);
    }

    return (
        <header className="topbar">
            <div className="topbar-heading">
                <div className="topbar-breadcrumb">
                    <span>HomeHub</span>
                    <ChevronRight size={15} />
                    <strong>{page.title}</strong>
                </div>

                <div className="topbar-page-title">
                    <span className="topbar-page-title__icon">
                        <PageIcon size={19} />
                    </span>
                    <h1>{page.title}</h1>
                </div>
            </div>

            <div className="topbar-actions">
                <form className="topbar-search" onSubmit={handleSearch}>
                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Tìm kiếm thiết bị..."
                        aria-label="Tìm kiếm thiết bị"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />

                    <kbd>Enter</kbd>
                </form>

                <div className="topbar-divider" />

                <button
                    type="button"
                    className="topbar-icon-button"
                    onClick={onToggleTheme}
                    aria-label={
                        theme === "dark"
                            ? "Chuyển sang giao diện sáng"
                            : "Chuyển sang giao diện tối"
                    }
                    title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
                >
                    {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <button
                    type="button"
                    className="topbar-icon-button topbar-notification"
                    aria-label="Thông báo"
                    title="Thông báo"
                >
                    <Bell size={19} />
                    <span className="topbar-notification__dot" />
                </button>

                <div className="topbar-divider topbar-divider--user" />

                <button
                    type="button"
                    className="topbar-user"
                    onClick={() => navigate("/settings")}
                    title="Thông tin tài khoản"
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
                        <small>{user?.role === "admin" ? "Quản trị viên" : "Tài khoản"}</small>
                    </span>

                    <UserRound className="topbar-user__profile-icon" size={16} />
                </button>
            </div>
        </header>
    );
}