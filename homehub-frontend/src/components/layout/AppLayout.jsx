import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUser } from "../../contexts/UserContext";
import "./styles/AppLayout.css";
import useDocumentTitle from "../../hooks/useDocuments";

export default function AppLayout() {
    useDocumentTitle();
    const navigate = useNavigate();
    const { user, userLoading, logout } = useUser();

    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("homehub-theme") === "dark"
                ? "dark"
                : "light";
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("homehub-theme", theme);
        } catch {
            // Bỏ qua nếu trình duyệt không cho phép lưu.
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) =>
            current === "light" ? "dark" : "light"
        );
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Đăng xuất gặp lỗi:", error);
        } finally {
            navigate("/login", { replace: true });
        }
    };

    return (
        <div className="app-layout" data-theme={theme}>
            <Sidebar
                user={user}
                loading={userLoading}
                onLogout={handleLogout}
            />

            <div className="app-main">
                <Topbar
                    user={user}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                />

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}