import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, ArrowRight, House } from "lucide-react";

import { apiRequest } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";

export default function Register() {
    useDocumentTitle();
    const navigate = useNavigate();
    const { user, userLoading } = useUser();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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

        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        try {
            await apiRequest("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            navigate("/login", {
                replace: true,
                state: { registered: true, email },
            });
        } catch (err) {
            setError(
                err.status === 409
                    ? "Email này đã được sử dụng."
                    : err.message || "Không thể tạo tài khoản. Vui lòng thử lại."
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
                    <span className="auth-brand__icon"><House size={23} /></span>
                    <span>Home<span>Hub</span></span>
                </Link>

                <div className="auth-visual__content">
                    <span className="auth-eyebrow">YOUR HOME, YOUR CONTROL</span>
                    <h1>
                        Tạo không gian
                        <br />
                        <span>sống của riêng bạn.</span>
                    </h1>
                    <p>
                        Bắt đầu hành trình quản lý ngôi nhà thông minh của bạn
                        với HomeHub.
                    </p>
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
                        BẮT ĐẦU MIỄN PHÍ
                    </span>
                    <h2>Tạo tài khoản</h2>
                    <p className="auth-subtitle">
                        Điền thông tin bên dưới để bắt đầu sử dụng HomeHub.
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="register-name">Họ và tên</label>
                        <div className="auth-input-wrap">
                            <UserRound size={18} />
                            <input
                                id="register-name"
                                type="text"
                                autoComplete="name"
                                placeholder="Nguyễn Văn A"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                required
                            />
                        </div>

                        <label htmlFor="register-email">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={18} />
                            <input
                                id="register-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>

                        <label htmlFor="register-password">Mật khẩu</label>
                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />
                            <input
                                id="register-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Ít nhất 8 ký tự"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />
                            <input
                                id="register-confirm-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                minLength={8}
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
                            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}