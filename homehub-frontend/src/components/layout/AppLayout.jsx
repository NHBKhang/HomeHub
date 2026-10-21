
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

import { useUser } from "../../contexts/UserContext";

import "./styles/AppLayout.css";
import useDocumentTitle from "../../hooks/useDocuments";
import { useTheme } from "../../contexts/ThemeContext";

export default function AppLayout() {
    useDocumentTitle();

    const { theme } = useTheme();
    const navigate = useNavigate();
    const { user, userLoading, logout } = useUser();

    const onLogout = async () => {
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
                onLogout={onLogout}
            />

            <div className="app-main">
                <Topbar
                    user={user}
                />

                <main className="page-content">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}