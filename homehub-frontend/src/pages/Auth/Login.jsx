import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { House, LockKeyhole, ArrowRight, UserRound, EyeOff, Eye } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";
import userService from "../../services/userSerivce";

export default function Login() {
    useDocumentTitle();

    const navigate = useNavigate();
    const location = useLocation();
    const { user, userLoading, loadUser } = useUser();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (userLoading) {
        return <div className="auth-loading">Đang kiểm tra tài khoản...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function onSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await userService.login(username.trim(), password);

            const currentUser = await loadUser();

            if (!currentUser) {
                throw new Error("Không thể tải thông tin tài khoản.");
            }

            const destination = location.state?.from;
            const target = destination
                ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
                : "/";

            navigate(target, { replace: true });
        } catch (err) {
            userService.logout();

            setError(
                err.status === 401
                    ? "Tên tài khoản hoặc mật khẩu không chính xác."
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
                        <span className="auth-brand__icon">
                            <House size={22} />
                        </span>
                        <strong>HomeHub</strong>
                    </div>

                    <span className="auth-eyebrow auth-eyebrow--muted">
                        CHÀO MỪNG TRỞ LẠI
                    </span>

                    <h2>Đăng nhập</h2>

                    <p className="auth-subtitle">
                        Đăng nhập để tiếp tục quản lý ngôi nhà của bạn.
                    </p>

                    <form className="auth-form" onSubmit={onSubmit}>
                        <label htmlFor="login-username">Username</label>

                        <div className="auth-input-wrap">
                            <UserRound size={18} />

                            <input
                                id="login-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                minLength={3}
                                maxLength={50}
                                pattern="[A-Za-z0-9_]+"
                                title="Tên đăng nhập chỉ được chứa chữ cái không dấu, chữ số và dấu gạch dưới."
                                required
                            />
                        </div>

                        <label htmlFor="login-password">Mật khẩu</label>

                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />

                            <input
                                id="login-password"
                                name="password"
                                type={show ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() =>
                                    setShow((prev) => !prev)
                                }
                                aria-label={
                                    show
                                        ? "Ẩn mật khẩu"
                                        : "Hiện mật khẩu"
                                }
                                aria-pressed={show}
                            >
                                {show ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <div className="auth-error" role="alert">
                                {error}
                            </div>
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
                        Chưa có tài khoản?{" "}
                        <Link to="/register">Tạo tài khoản</Link>
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