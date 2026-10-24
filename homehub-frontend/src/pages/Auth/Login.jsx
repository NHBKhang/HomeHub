
import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
    House,
    LockKeyhole,
    ArrowRight,
    UserRound,
    EyeOff,
    Eye,
    Languages,
    ChevronDown,
    Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";
import userService from "../../services/userSerivce";

export default function Login() {
    useDocumentTitle();

    const { t, i18n } = useTranslation();
    const [languageOpen, setLanguageOpen] = useState(false);
    const languageRef = useRef(null);

    const currentLanguage = i18n.resolvedLanguage || i18n.language;

    async function selectLanguage(language) {
        await i18n.changeLanguage(language);
        setLanguageOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                languageRef.current &&
                !languageRef.current.contains(event.target)
            ) {
                setLanguageOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setLanguageOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, userLoading, loadUser } = useUser();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (userLoading) {
        return (
            <div className="auth-loading">
                {t("login.checkingAccount")}
            </div>
        );
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
                throw new Error("USER_LOAD_FAILED");
            }

            const destination = location.state?.from;
            const target = destination
                ? `${destination.pathname}${destination.search || ""}${destination.hash || ""}`
                : "/";

            navigate(target, { replace: true });
        } catch (err) {
            userService.logout();

            if (err.status === 401) {
                setError(t("login.errors.invalidCredentials"));
            } else if (err.message === "USER_LOAD_FAILED") {
                setError(t("login.errors.userLoadFailed"));
            } else {
                setError(err.message || t("login.errors.general"));
            }
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
                    <span className="auth-eyebrow">
                        {t("login.visual.eyebrow")}
                    </span>

                    <h1>
                        {t("login.visual.titleLine1")}
                        <br />
                        <span>{t("login.visual.titleLine2")}</span>
                    </h1>

                    <p>{t("login.visual.description")}</p>

                    <div className="auth-feature">
                        <span className="auth-feature__dot" />
                        {t("login.visual.feature")}
                    </div>
                </div>

                <span className="auth-visual__footer">
                    {t("login.visual.footer")}
                </span>
            </section>

            <section className="auth-panel">
                <div className="auth-form-wrap">
                    <div className="auth-language" ref={languageRef}>
                        <button
                            type="button"
                            className="auth-language__trigger"
                            onClick={() => setLanguageOpen((prev) => !prev)}
                            aria-expanded={languageOpen}
                            aria-haspopup="menu"
                            aria-label={t("login.language.ariaLabel")}
                        >
                            <Languages size={17} />

                            <span>
                                {currentLanguage.startsWith("vi") ? "VI" : "EN"}
                            </span>

                            <ChevronDown
                                size={15}
                                className={languageOpen ? "is-open" : ""}
                            />
                        </button>

                        {languageOpen && (
                            <div className="auth-language__menu" role="menu">
                                <button
                                    type="button"
                                    role="menuitem"
                                    className="auth-language__option"
                                    onClick={() => selectLanguage("vi")}
                                >
                                    <span className="auth-language__flag">🇻🇳</span>
                                    <span>Tiếng Việt</span>
                                    {currentLanguage.startsWith("vi") && (
                                        <Check size={16} className="auth-language__check" />
                                    )}
                                </button>

                                <button
                                    type="button"
                                    role="menuitem"
                                    className="auth-language__option"
                                    onClick={() => selectLanguage("en")}
                                >
                                    <span className="auth-language__flag">🇬🇧</span>
                                    <span>English</span>
                                    {currentLanguage.startsWith("en") && (
                                        <Check size={16} className="auth-language__check" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    <span className="auth-eyebrow auth-eyebrow--muted">
                        {t("login.welcome")}
                    </span>

                    <h2>{t("login.title")}</h2>

                    <p className="auth-subtitle">
                        {t("login.subtitle")}
                    </p>

                    <form className="auth-form" onSubmit={onSubmit}>
                        <label htmlFor="login-username">
                            {t("common.basicInfo.username.label")}
                        </label>

                        <div className="auth-input-wrap">
                            <UserRound size={18} />

                            <input
                                id="login-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder={t("common.basicInfo.username.placeholder")}
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                minLength={3}
                                maxLength={50}
                                pattern="[A-Za-z0-9_]+"
                                title={t("common.basicInfo.username.validation")}
                                required
                            />
                        </div>

                        <label htmlFor="login-password">
                            {t("common.basicInfo.password.label")}
                        </label>

                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />

                            <input
                                id="login-password"
                                name="password"
                                type={show ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder={t("common.basicInfo.password.placeholder")}
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => setShow((prev) => !prev)}
                                aria-label={
                                    show
                                        ? t("common.basicInfo.password.hide")
                                        : t("common.basicInfo.password.show")
                                }
                                aria-pressed={show}
                            >
                                {show
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
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
                            {loading
                                ? t("login.submitting")
                                : t("login.submit")}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {t("login.noAccount")}{" "}
                        <Link to="/register">
                            {t("login.registerLink")}
                        </Link>
                    </p>

                    <p className="auth-legal">
                        {t("login.legal")}
                    </p>
                </div>
            </section>
        </main>
    );
}