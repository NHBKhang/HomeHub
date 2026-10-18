import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { House, LockKeyhole, Mail, ArrowRight } from "lucide-react";

import { apiRequest } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";

export default function Login() {
    useDocumentTitle();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userLoading, fetchUser } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (userLoading) {
        return <div className="auth-loading">Đang kiểm tra tài khoản...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (!data?.access_token) {
                throw new Error("Máy chủ không trả về access token.");
            }

            localStorage.setItem("access_token", data.access_token);
            await fetchUser();

            const destination = location.state?.from;
            const target = destination
                ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
                : "/";

            navigate(target, { replace: true });
        } catch (err) {
            localStorage.removeItem("access_token");
            setError(
                err.status === 401
                    ? "Email hoặc mật khẩu không chính xác."
                    : err.message || "Đăng nhập thất bại. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-visual">
                <div className="auth-visual__glow" />

                <Link to="/login" className="auth-brand">
                    <span className="auth-brand__icon">
                        <House size={23} />
                    </span>
                    <span>Home<span>Hub</span></span>
                </Link>

                <div className="auth-visual__content">
                    <span className="auth-eyebrow">SMART LIVING PLATFORM</span>
                    <h1>
                        Ngôi nhà thông minh,
                        <br />
                        <span>bắt đầu từ bạn.</span>
                    </h1>
                    <p>
                        Quản lý thiết bị, công việc và chi tiêu trong một không gian
                        đơn giản, tiện nghi và an toàn.
                    </p>

                    <div className="auth-feature">
                        <span className="auth-feature__dot" />
                        Một không gian. Mọi thứ trong tầm tay.
                    </div>
                </div>

                <span className="auth-visual__footer">
                    HOMEHUB · SMARTER EVERYDAY
                </span>
            </section>

            <section className="auth-panel">
                <div className="auth-form-wrap">
                    <div className="auth-mobile-brand">
                        <span className="auth-brand__icon"><House size={22} /></span>
                        <strong>HomeHub</strong>
                    </div>

                    <span className="auth-eyebrow auth-eyebrow--muted">
                        CHÀO MỪNG TRỞ LẠI
                    </span>
                    <h2>Đăng nhập</h2>
                    <p className="auth-subtitle">
                        Đăng nhập để tiếp tục quản lý ngôi nhà của bạn.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="login-email">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={18} />
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <label htmlFor="login-password">Mật khẩu</label>
                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="auth-error" role="alert">{error}</div>
                        )}

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
                    </p>

                    <p className="auth-legal">
                        Bằng việc tiếp tục, bạn đồng ý với các điều khoản sử dụng
                        của HomeHub.
                    </p>
                </div>
            </section>
        </main>
    );
}