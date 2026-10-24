
import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    UserRound,
    Mail,
    LockKeyhole,
    ArrowRight,
    House,
    Eye,
    EyeOff,
    Languages,
    ChevronDown,
    Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { useUser } from "../../contexts/UserContext";
import "./Auth.css";
import useDocumentTitle from "../../hooks/useDocuments";
import userService from "../../services/userSerivce";

export default function Register() {
    useDocumentTitle();

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, userLoading } = useUser();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const languageRef = useRef(null);

    const currentLanguage = i18n.resolvedLanguage || i18n.language;
    const isVietnamese = currentLanguage.startsWith("vi");

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

    async function selectLanguage(language) {
        await i18n.changeLanguage(language);
        setLanguageOpen(false);
    }

    const updateUserData = (event) => {
        const { name, value } = event.target;

        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateShow = (field) => {
        setShow((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    if (userLoading) {
        return (
            <div className="auth-loading">
                {t("register.checkingAccount")}
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const submitForm = async (event) => {
        event.preventDefault();
        setError("");

        if (userData.password.length < 8) {
            setError(t("register.errors.passwordTooShort"));
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            setError(t("register.errors.passwordMismatch"));
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
                setError(t("register.errors.conflict"));
            } else if (err.status === 422) {
                setError(t("register.errors.invalidData"));
            } else {
                setError(
                    err.message || t("register.errors.general")
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
                    <span className="auth-brand__icon">
                        <House size={23} />
                    </span>
                    <span>Home<span>Hub</span></span>
                </Link>

                <div className="auth-visual__content">
                    <span className="auth-eyebrow">
                        {t("register.visual.eyebrow")}
                    </span>

                    <h1>
                        {t("register.visual.titleLine1")}
                        <br />
                        <span>{t("register.visual.titleLine2")}</span>
                    </h1>

                    <p>{t("register.visual.description")}</p>
                </div>

                <span className="auth-visual__footer">
                    {t("register.visual.footer")}
                </span>
            </section>

            <section className="auth-panel">
                <div className="auth-form-wrap">
                    <div className="auth-form-topbar">
                        <div className="auth-mobile-brand">
                            <span className="auth-brand__icon">
                                <House size={22} />
                            </span>
                            <strong>HomeHub</strong>
                        </div>

                        <div className="auth-language" ref={languageRef}>
                            <button
                                type="button"
                                className="auth-language__trigger"
                                onClick={() =>
                                    setLanguageOpen((prev) => !prev)
                                }
                                aria-expanded={languageOpen}
                                aria-haspopup="menu"
                                aria-label={t("register.language.ariaLabel")}
                            >
                                <Languages size={17} />
                                <span>{isVietnamese ? "VI" : "EN"}</span>
                                <ChevronDown
                                    size={15}
                                    className={languageOpen ? "is-open" : ""}
                                />
                            </button>

                            {languageOpen && (
                                <div
                                    className="auth-language__menu"
                                    role="menu"
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="auth-language__option"
                                        onClick={() => selectLanguage("vi")}
                                    >
                                        <span className="auth-language__flag">
                                            🇻🇳
                                        </span>
                                        <span>Tiếng Việt</span>
                                        {isVietnamese && (
                                            <Check
                                                size={16}
                                                className="auth-language__check"
                                            />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="auth-language__option"
                                        onClick={() => selectLanguage("en")}
                                    >
                                        <span className="auth-language__flag">
                                            🇬🇧
                                        </span>
                                        <span>English</span>
                                        {!isVietnamese && (
                                            <Check
                                                size={16}
                                                className="auth-language__check"
                                            />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <span className="auth-eyebrow auth-eyebrow--muted">
                        {t("register.welcome")}
                    </span>

                    <h2>{t("register.title")}</h2>

                    <p className="auth-subtitle">
                        {t("register.subtitle")}
                    </p>

                    <form className="auth-form" onSubmit={submitForm}>
                        <label htmlFor="register-username">
                            {t("common.basicInfo.username.label")}
                        </label>

                        <div className="auth-input-wrap">
                            <UserRound size={18} />
                            <input
                                id="register-username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                placeholder={t("common.basicInfo.username.placeholder")}
                                value={userData.username}
                                onChange={updateUserData}
                                minLength={3}
                                maxLength={50}
                                pattern="[A-Za-z0-9_]+"
                                title={t("common.basicInfo.username.validation")}
                                required
                            />
                        </div>

                        <div className="auth-name-row">
                            <div className="auth-name-field">
                                <label htmlFor="register-last-name">
                                    {t("common.basicInfo.lastName.label")}
                                </label>

                                <div className="auth-input-wrap">
                                    <UserRound size={18} />
                                    <input
                                        id="register-last-name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder={t("common.basicInfo.lastName.placeholder")}
                                        value={userData.last_name}
                                        onChange={updateUserData}
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-name-field">
                                <label htmlFor="register-first-name">
                                    {t("common.basicInfo.firstName.label")}
                                </label>

                                <div className="auth-input-wrap">
                                    <UserRound size={18} />
                                    <input
                                        id="register-first-name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder={t("common.basicInfo.firstName.placeholder")}
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
                                placeholder="name@example.com"
                                value={userData.email}
                                onChange={updateUserData}
                                required
                            />
                        </div>

                        <label htmlFor="register-password">
                            {t("common.basicInfo.password.label")}
                        </label>

                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />
                            <input
                                id="register-password"
                                name="password"
                                type={show.password ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder={t("common.basicInfo.password.placeholder")}
                                value={userData.password}
                                onChange={updateUserData}
                                minLength={8}
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => updateShow("password")}
                                aria-label={
                                    show.password
                                        ? t("common.basicInfo.password.hide")
                                        : t("common.basicInfo.password.show")
                                }
                                aria-pressed={show.password}
                            >
                                {show.password
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>
                        </div>

                        <label htmlFor="register-confirm-password">
                            {t("common.basicInfo.confirmPassword.label")}
                        </label>

                        <div className="auth-input-wrap">
                            <LockKeyhole size={18} />
                            <input
                                id="register-confirm-password"
                                name="confirmPassword"
                                type={show.confirm ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder={t("common.basicInfo.confirmPassword.placeholder")}
                                value={userData.confirmPassword}
                                onChange={updateUserData}
                                minLength={8}
                                required
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() => updateShow("confirm")}
                                aria-label={
                                    show.confirm
                                        ? t("common.basicInfo.confirmPassword.hide")
                                        : t("common.basicInfo.confirmPassword.show")
                                }
                                aria-pressed={show.confirm}
                            >
                                {show.confirm
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
                                ? t("register.submitting")
                                : t("register.submit")}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {t("register.haveAccount")}{" "}
                        <Link to="/login">
                            {t("register.loginLink")}
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}