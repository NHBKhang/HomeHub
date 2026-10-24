
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    AtSign,
    CalendarDays,
    CheckCircle2,
    Clock3,
    KeyRound,
    LogOut,
    Mail,
    Pencil,
    RefreshCw,
    Save,
    ShieldCheck,
    UserRound,
    Smartphone,
    Monitor,
    ChevronRight,
    LockKeyhole,
    History,
    Bell,
} from "lucide-react";

import { useUser } from "../../contexts/UserContext";
import useDocumentTitle from "../../hooks/useDocuments";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import "./Profile.css";
import userService from "../../services/userSerivce";
import Modal from "../../components/ui/Modal";
import Message from "../../components/ui/Message";
import formatDate from "../../utils/formatDate";

function getInitials(user) {
    const name = user?.full_name?.trim();

    if (name) {
        return name
            .split(/\s+/)
            .slice(-2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
    }

    return user?.username?.slice(0, 2).toUpperCase() || "HH";
}

function ProfileInfo({ icon: Icon, label, value, fallback }) {
    return (
        <div className="profile-info">
            <span className="profile-info__icon">
                <Icon size={19} />
            </span>

            <div className="profile-info__content">
                <span className="profile-info__label">
                    {label}
                </span>

                <span className="profile-info__value">
                    {value || fallback}
                </span>
            </div>
        </div>
    );
}

function SecurityItem({
    icon: Icon,
    title,
    description,
    status,
    disabled = true,
    onClick,
}) {
    return (
        <button
            type="button"
            className="profile-security-item"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="profile-security-item__icon">
                <Icon size={19} />
            </span>

            <span className="profile-security-item__content">
                <strong>{title}</strong>
                <span>{description}</span>
            </span>

            <span className="profile-security-item__status">
                {status}
            </span>

            <ChevronRight size={17} />
        </button>
    );
}

export default function Profile() {
    useDocumentTitle();

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const language = (
        i18n.resolvedLanguage ||
        i18n.language ||
        "vi"
    ).split("-")[0];

    const {
        user,
        userLoading,
        userError,
        loadUser,
        logout,
    } = useUser();

    const [refreshing, setRefreshing] = useState(false);
    const [message, setMessage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });

    function showMessage(type, text) {
        setMessage({ type, text });
    }

    useEffect(() => {
        if (!user) return;

        setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
        });
    }, [user]);

    useEffect(() => {
        if (!userLoading && !user) {
            navigate("/login", { replace: true });
        }
    }, [user, userLoading, navigate]);

    async function refresh() {
        setRefreshing(true);
        setMessage(null);

        try {
            await loadUser();
            setIsEditing(false);
        } catch (error) {
            showMessage(
                "danger",
                error.message || t("profile.refreshError")
            );
        } finally {
            setRefreshing(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setMessage(null);

        const payload = {
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim(),
        };

        if (
            !payload.first_name ||
            !payload.last_name ||
            !payload.email
        ) {
            showMessage("danger", t("profile.fillRequired"));
            return;
        }

        setSaving(true);

        try {
            await userService.updateProfile(payload);
            await loadUser();

            setIsEditing(false);

            showMessage(
                "success",
                t("profile.updateSuccess")
            );
        } catch (error) {
            showMessage(
                "danger",
                error.message || t("profile.updateError")
            );
        } finally {
            setSaving(false);
        }
    }

    function onLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    if (userLoading || !user) {
        return (
            <main className="profile-loading">
                <RefreshCw
                    size={22}
                    className="profile-spin"
                />

                <span>{t("profile.loadingProfile")}</span>
            </main>
        );
    }

    const fullName =
        user.full_name ||
        `${user.last_name || ""} ${user.first_name || ""}`.trim();

    const dateFallback = t("profile.notUpdated");

    return (
        <main className="profile-page">
            <div className="profile-container">
                <header className="profile-heading">
                    <div>
                        <h1>{t("profile.title")}</h1>
                        <p>{t("profile.description")}</p>
                    </div>

                    <div className="profile-heading__actions">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            className="profile-action-button"
                            startIcon={<RefreshCw size={17} />}
                            loading={refreshing}
                            disabled={saving}
                            onClick={refresh}
                        >
                            {refreshing
                                ? t("common.loading")
                                : t("common.refresh")}
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            size="md"
                            className="profile-action-button"
                            startIcon={<Pencil size={16} />}
                            disabled={refreshing || saving}
                            onClick={() => setIsEditing(true)}
                        >
                            {t("profile.edit")}
                        </Button>
                    </div>
                </header>

                {(message?.text || userError) && (
                    <Message
                        variant={
                            message?.text
                                ? message.type
                                : "danger"
                        }
                        onClose={() => setMessage(null)}
                        message={message?.text || userError}
                    />
                )}

                <section className="profile-overview">
                    <div className="profile-avatar">
                        {getInitials(user)}
                    </div>

                    <div className="profile-overview__content">
                        <h2>{fullName || user.username}</h2>

                        <p>
                            <AtSign size={15} />
                            {user.username}
                        </p>

                        <div className="profile-badges">
                            <span
                                className={`profile-badge ${user.is_active
                                        ? "profile-badge--active"
                                        : "profile-badge--inactive"
                                    }`}
                            >
                                <span className="profile-badge__dot" />

                                {user.is_active
                                    ? t("profile.active")
                                    : t("profile.inactive")}
                            </span>

                            {user.is_superuser && (
                                <span className="profile-badge profile-badge--admin">
                                    <ShieldCheck size={14} />
                                    {t("common.admin")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-member">
                        <span>{t("profile.memberSince")}</span>

                        <strong>
                            {formatDate(
                                user.created_at,
                                language,
                                dateFallback
                            )}
                        </strong>
                    </div>
                </section>

                <div className="profile-grid">
                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span className="profile-card__icon">
                                <UserRound size={20} />
                            </span>

                            <div>
                                <h3>{t("profile.personalInfo")}</h3>
                                <p>
                                    {t("profile.personalInfoDescription")}
                                </p>
                            </div>
                        </div>

                        <div className="profile-info-list">
                            <ProfileInfo
                                icon={UserRound}
                                label={t("profile.fullName")}
                                value={fullName}
                                fallback={dateFallback}
                            />

                            <ProfileInfo
                                icon={AtSign}
                                label={t("common.basicInfo.username.label")}
                                value={user.username}
                                fallback={dateFallback}
                            />

                            <ProfileInfo
                                icon={Mail}
                                label="Email"
                                value={user.email}
                                fallback={dateFallback}
                            />
                        </div>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span className="profile-card__icon">
                                <ShieldCheck size={20} />
                            </span>

                            <div>
                                <h3>{t("profile.account")}</h3>
                                <p>
                                    {t("profile.accountDescription")}
                                </p>
                            </div>
                        </div>

                        <div className="profile-info-list">
                            <ProfileInfo
                                icon={KeyRound}
                                label={t("profile.accountType")}
                                value={
                                    user.is_superuser
                                        ? t("common.admin")
                                        : t("common.user")
                                }
                                fallback={dateFallback}
                            />

                            <ProfileInfo
                                icon={CheckCircle2}
                                label={t("profile.status")}
                                value={
                                    user.is_active
                                        ? t("profile.active")
                                        : t("profile.inactive")
                                }
                                fallback={dateFallback}
                            />

                            <ProfileInfo
                                icon={CalendarDays}
                                label={t("profile.createdAt")}
                                value={formatDate(
                                    user.created_at,
                                    language,
                                    dateFallback
                                )}
                                fallback={dateFallback}
                            />

                            <ProfileInfo
                                icon={Clock3}
                                label={t("profile.updatedAt")}
                                value={formatDate(
                                    user.updated_at,
                                    language,
                                    dateFallback
                                )}
                                fallback={dateFallback}
                            />
                        </div>
                    </section>
                </div>

                <section className="profile-card profile-security-card">
                    <div className="profile-card__heading">
                        <span className="profile-card__icon">
                            <LockKeyhole size={20} />
                        </span>

                        <div>
                            <h3>{t("profile.security")}</h3>
                            <p>{t("profile.securityDescription")}</p>
                        </div>
                    </div>

                    <div className="profile-security-list">
                        <SecurityItem
                            icon={KeyRound}
                            title={t("profile.changePassword")}
                            description={t(
                                "profile.changePasswordDescription"
                            )}
                            status={t("profile.notConfigured")}
                        />

                        <SecurityItem
                            icon={ShieldCheck}
                            title={t("profile.twoFactor")}
                            description={t(
                                "profile.twoFactorDescription"
                            )}
                            status={t("profile.comingSoon")}
                        />

                        <SecurityItem
                            icon={Monitor}
                            title={t("profile.devicesSessions")}
                            description={t(
                                "profile.devicesSessionsDescription"
                            )}
                            status={t("profile.comingSoon")}
                        />

                        <SecurityItem
                            icon={History}
                            title={t("profile.securityHistory")}
                            description={t(
                                "profile.securityHistoryDescription"
                            )}
                            status={t("profile.comingSoon")}
                        />

                        <SecurityItem
                            icon={Bell}
                            title={t("profile.securityNotifications")}
                            description={t(
                                "profile.securityNotificationsDescription"
                            )}
                            status={t("profile.comingSoon")}
                        />

                        <SecurityItem
                            icon={Smartphone}
                            title={t("profile.recoveryMethods")}
                            description={t(
                                "profile.recoveryMethodsDescription"
                            )}
                            status={t("profile.comingSoon")}
                        />
                    </div>

                    <div className="profile-security-note">
                        <ShieldCheck size={18} />
                        <p>{t("profile.securityNote")}</p>
                    </div>
                </section>

                <section className="profile-logout-card">
                    <div className="profile-logout-card__text">
                        <h3>{t("profile.logoutTitle")}</h3>
                        <p>{t("profile.logoutDescription")}</p>
                    </div>

                    <Button
                        type="button"
                        variant="danger"
                        size="md"
                        className="profile-logout-button"
                        startIcon={<LogOut size={17} />}
                        onClick={onLogout}
                        outline
                    >
                        {t("common.logout")}
                    </Button>
                </section>

                <Modal
                    isOpen={isEditing}
                    onClose={() => {
                        if (!saving) setIsEditing(false);
                    }}
                    eyebrow={t("profile.accountSettings")}
                    title={t("profile.editTitle")}
                    description={t("profile.editDescription")}
                    size="md"
                    isLoading={saving}
                    footer={
                        <>
                            <Button
                                type="button"
                                variant="secondary"
                                size="md"
                                disabled={saving}
                                onClick={() => setIsEditing(false)}
                            >
                                {t("common.cancel")}
                            </Button>

                            <Button
                                type="submit"
                                form="profile-edit-form"
                                variant="primary"
                                size="md"
                                loading={saving}
                                disabled={saving}
                                startIcon={<Save size={16} />}
                            >
                                {saving
                                    ? t("common.saving")
                                    : t("common.saveChanges")}
                            </Button>
                        </>
                    }
                >
                    <form
                        id="profile-edit-form"
                        className="profile-edit-form"
                        onSubmit={handleSave}
                    >
                        <div className="profile-edit-form__row">
                            <Input
                                label={t("common.basicInfo.lastName.label")}
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder={t(
                                    "common.basicInfo.lastName.placeholder"
                                )}
                                autoComplete="family-name"
                                required
                                disabled={saving}
                                className="profile-edit-form__field"
                            />

                            <Input
                                label={t("common.basicInfo.firstName.label")}
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder={t(
                                    "common.basicInfo.firstName.placeholder"
                                )}
                                autoComplete="given-name"
                                required
                                disabled={saving}
                                className="profile-edit-form__field"
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            autoComplete="email"
                            required
                            disabled={saving}
                            className="profile-edit-form__field"
                        />
                    </form>
                </Modal>
            </div>
        </main>
    );
}