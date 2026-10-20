import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    UserRound, Mail, LockKeyhole, ArrowRight, House,
    Eye, EyeOff,
} from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";
import userService from "../../services/userSerivce";

export default function Register() {
    useDocumentTitle();
    const navigate = useNavigate();
    const { user, userLoading } = useUser();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [userData, setUserData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        password: false,
        confirm: false,
    });

    const updateUserData = (event) => {
        const { name, value } = event.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateShow = (field, value) => {
        setShow((prev) => ({
            ...prev,
            [field]: typeof value === "function"
                ? value(prev[field])
                : value,
        }));
    };
    if (userLoading) {
        return <div className="auth-loading">Đang kiểm tra tài khoản...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setError("");

        if (userData.password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setLoading(true);

        try {
            await userService.register({
                username: userData.username.trim(),
                first_name: userData.first_name.trim(),
                last_name: userData.last_name.trim(),
                email: userData.email.trim(),
                password: userData.password,
            });

            navigate("/login", {
                replace: true,
                state: {
                    registered: true,
                    username: userData.username.trim(),
                },
            });
        } catch (err) {
            if (err.status === 409) {
                setError("Username hoặc email đã được sử dụng.");
            } else if (err.status === 422) {
                setError("Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.");
            } else {
                setError(
                    err.message || "Không thể tạo tài khoản. Vui lòng thử lại."
                );
            }
        } finally {
            setLoading(false);
        }
    };

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

                    <form className="auth-form" onSubmit={submitForm}>
                        <label htmlFor="register-username">Tên đăng nhập</label>
                        <div className="auth-input-wrap">
                            <UserRound size={18} />
                            <input
                                id="register-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder="username"
                                value={userData.username}
                                onChange={updateUserData}
                                minLength={3}
                                maxLength={50}
                                pattern="[A-Za-z0-9_]+"
                                title="Tên đăng nhập chỉ được chứa chữ cái không dấu, chữ số và dấu gạch dưới."
                                required
                            />
                        </div>

                        <div className="auth-name-row">
                            <div className="auth-name-field">
                                <label htmlFor="register-last-name">Họ</label>
                                <div className="auth-input-wrap">
                                    <UserRound size={18} />
                                    <input
                                        id="register-last-name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Nguyễn"
                                        value={userData.last_name}
                                        onChange={updateUserData}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-name-field">
                                <label htmlFor="register-first-name">Tên</label>
                                <div className="auth-input-wrap">
                                    <UserRound size={18} />
                                    <input
                                        id="register-first-name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="Văn A"
                                        value={userData.first_name}
                                        onChange={updateUserData}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <label htmlFor="register-email">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={18} />
                            <input
                                id="register-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={userData.email}
                                onChange={updateUserData}
                                required
                            />
                        </div>

                        <label htmlFor="register-password">Mật khẩu</label>
                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />

                            <input
                                id="register-password"
                                name="password"
                                type={show.password ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Ít nhất 8 ký tự"
                                value={userData.password}
                                onChange={updateUserData}
                                minLength={8}
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() =>
                                    updateShow("password", (prev) => !prev)
                                }
                                aria-label={show.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                aria-pressed={show.password}
                            >
                                {show.password ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <label htmlFor="register-confirm-password">
                            Xác nhận mật khẩu
                        </label>
                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />

                            <input
                                id="register-confirm-password"
                                name="confirmPassword"
                                type={show.confirm ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Nhập lại mật khẩu"
                                value={userData.confirm}
                                onChange={updateUserData}
                                minLength={8}
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() =>
                                    updateShow("confirm", (prev) => !prev)
                                }
                                aria-label={
                                    show.confirm
                                        ? "Ẩn mật khẩu xác nhận"
                                        : "Hiện mật khẩu xác nhận"
                                }
                                aria-pressed={show.confirm}
                            >
                                {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
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