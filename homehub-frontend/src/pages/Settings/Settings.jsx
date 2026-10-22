
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Bell,
    Check,
    ChevronRight,
    Globe,
    Languages,
    Monitor,
    Moon,
    Palette,
    RotateCcw,
    Save,
    ShieldCheck,
    Sun,
    Volume2,
    Wifi,
} from "lucide-react";

import useDocumentTitle from "../../hooks/useDocuments";
import "./Settings.css";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const defaultSettings = {
    theme: "light",
    language: "vi",
    deviceNotifications: true,
    securityNotifications: true,
    systemNotifications: false,
    soundEnabled: true,
    compactMode: false,
    showDeviceStatus: true,
};

function SettingsSection({ icon: Icon, title, description, children }) {
    return (
        <section className="settings-card">
            <div className="settings-card__heading">
                <span className="settings-card__icon">
                    <Icon size={20} />
                </span>
                <div>
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
            <div className="settings-card__body">{children}</div>
        </section>
    );
}

function SettingsRow({
    icon: Icon,
    title,
    description,
    children,
    last = false,
}) {
    return (
        <div className={`settings-row${last ? " settings-row--last" : ""}`}>
            <span className="settings-row__icon">
                <Icon size={19} />
            </span>
            <div className="settings-row__content">
                <strong>{title}</strong>
                <p>{description}</p>
            </div>
            <div className="settings-row__control">{children}</div>
        </div>
    );
}

function SettingsToggle({ checked, onChange, label }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={`settings-toggle${checked ? " is-active" : ""}`}
            onClick={() => onChange(!checked)}
        >
            <span className="settings-toggle__thumb" />
        </button>
    );
}

export default function Settings() {
    useDocumentTitle();

    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const language = i18n.resolvedLanguage || i18n.language || "vi";

    const [settings, setSettings] = useState({
        ...defaultSettings,
        theme,
        language,
    });
    const [saved, setSaved] = useState(false);
    const [resetting, setResetting] = useState(false);

    useEffect(() => {
        setSettings((current) => ({
            ...current,
            theme,
        }));
    }, [theme]);

    useEffect(() => {
        setSettings((current) => ({
            ...current,
            language,
        }));
    }, [language]);

    function updateSetting(key, value) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));
        setSaved(false);
    }

    function handleThemeChange(nextTheme) {
        if (theme !== nextTheme) {
            toggleTheme();
        }

        updateSetting("theme", nextTheme);
    }

    async function handleLanguageChange(nextLanguage) {
        try {
            await i18n.changeLanguage(nextLanguage);
            updateSetting("language", nextLanguage);
        } catch {
            // Giữ nguyên ngôn ngữ hiện tại nếu đổi ngôn ngữ thất bại.
        }
    }

    function handleSave() {
        setSaved(true);
    }

    function handleReset() {
        const nextTheme = defaultSettings.theme;
        const nextLanguage = defaultSettings.language;

        if (theme !== nextTheme) {
            toggleTheme();
        }

        i18n.changeLanguage(nextLanguage);

        setSettings({ ...defaultSettings });
        setSaved(false);
        setResetting(false);
    }

    return (
        <main className="settings-page">
            <div className="settings-container">
                <header className="settings-heading">
                    <div>
                        <h1>{t("settings.title")}</h1>
                        <p>{t("settings.pageDescription")}</p>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        className="settings-save"
                        onClick={handleSave}
                        startIcon={
                            saved ? <Check size={17} /> : <Save size={17} />
                        }
                    >
                        {saved
                            ? t("settings.confirmed")
                            : t("settings.save")}
                    </Button>
                </header>

                {saved && (
                    <Message
                        variant="success"
                        message={t("settings.sessionSaveNotice")}
                        onClose={() => setSaved(false)}
                    />
                )}

                <div className="settings-layout">
                    <div className="settings-main">
                        <SettingsSection
                            icon={Palette}
                            title={t("settings.appearance")}
                            description={t("settings.appearanceDescription")}
                        >
                            <SettingsRow
                                icon={Sun}
                                title={t("settings.theme")}
                                description={t("settings.themeDescription")}
                            >
                                <div className="settings-segmented">
                                    <button
                                        type="button"
                                        className={
                                            settings.theme === "light"
                                                ? "is-selected"
                                                : ""
                                        }
                                        onClick={() => handleThemeChange("light")}
                                        aria-pressed={settings.theme === "light"}
                                    >
                                        <Sun size={15} />
                                        {t("common.lightTheme")}
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            settings.theme === "dark"
                                                ? "is-selected"
                                                : ""
                                        }
                                        onClick={() => handleThemeChange("dark")}
                                        aria-pressed={settings.theme === "dark"}
                                    >
                                        <Moon size={15} />
                                        {t("common.darkTheme")}
                                    </button>
                                </div>
                            </SettingsRow>

                            <SettingsRow
                                icon={Monitor}
                                title={t("settings.compactMode")}
                                description={t("settings.compactModeDescription")}
                            >
                                <SettingsToggle
                                    label={t("settings.compactMode")}
                                    checked={settings.compactMode}
                                    onChange={(value) =>
                                        updateSetting("compactMode", value)
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Languages}
                                title={t("settings.language")}
                                description={t("settings.languageDescription")}
                                last
                            >
                                <select
                                    className="settings-select"
                                    value={language}
                                    onChange={(event) =>
                                        handleLanguageChange(event.target.value)
                                    }
                                    aria-label={t("common.language")}
                                >
                                    <option value="vi">
                                        {t("common.vietnamese")}
                                    </option>
                                    <option value="en">
                                        {t("common.english")}
                                    </option>
                                </select>
                            </SettingsRow>
                        </SettingsSection>

                        <SettingsSection
                            icon={Bell}
                            title={t("settings.notifications")}
                            description={t("settings.notificationsDescription")}
                        >
                            <SettingsRow
                                icon={Wifi}
                                title={t("settings.deviceNotifications")}
                                description={t("settings.deviceNotificationsDescription")}
                            >
                                <SettingsToggle
                                    label={t("settings.deviceNotifications")}
                                    checked={settings.deviceNotifications}
                                    onChange={(value) =>
                                        updateSetting("deviceNotifications", value)
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={ShieldCheck}
                                title={t("settings.securityNotifications")}
                                description={t("settings.securityNotificationsDescription")}
                            >
                                <SettingsToggle
                                    label={t("settings.securityNotifications")}
                                    checked={settings.securityNotifications}
                                    onChange={(value) =>
                                        updateSetting("securityNotifications", value)
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Bell}
                                title={t("settings.systemNotifications")}
                                description={t("settings.systemNotificationsDescription")}
                            >
                                <SettingsToggle
                                    label={t("settings.systemNotifications")}
                                    checked={settings.systemNotifications}
                                    onChange={(value) =>
                                        updateSetting("systemNotifications", value)
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Volume2}
                                title={t("settings.sound")}
                                description={t("settings.soundDescription")}
                                last
                            >
                                <SettingsToggle
                                    label={t("settings.sound")}
                                    checked={settings.soundEnabled}
                                    onChange={(value) =>
                                        updateSetting("soundEnabled", value)
                                    }
                                />
                            </SettingsRow>
                        </SettingsSection>

                        <SettingsSection
                            icon={ShieldCheck}
                            title={t("settings.privacy")}
                            description={t("settings.privacyDescription")}
                        >
                            <SettingsRow
                                icon={Monitor}
                                title={t("settings.showDeviceStatus")}
                                description={t("settings.showDeviceStatusDescription")}
                                last
                            >
                                <SettingsToggle
                                    label={t("settings.showDeviceStatus")}
                                    checked={settings.showDeviceStatus}
                                    onChange={(value) =>
                                        updateSetting("showDeviceStatus", value)
                                    }
                                />
                            </SettingsRow>
                        </SettingsSection>
                    </div>

                    <aside className="settings-sidebar">
                        <section className="settings-summary">
                            <span className="settings-summary__icon">
                                <Globe size={22} />
                            </span>

                            <h2>{t("settings.experienceTitle")}</h2>
                            <p>{t("settings.experienceDescription")}</p>

                            <div className="settings-summary__divider" />

                            <div className="settings-summary__item">
                                <span>{t("settings.language")}</span>
                                <strong>
                                    {language === "vi"
                                        ? t("common.vietnamese")
                                        : t("common.english")}
                                </strong>
                            </div>

                            <div className="settings-summary__item">
                                <span>{t("settings.theme")}</span>
                                <strong>
                                    {settings.theme === "light"
                                        ? t("common.lightTheme")
                                        : t("common.darkTheme")}
                                </strong>
                            </div>

                            <div className="settings-summary__item">
                                <span>{t("settings.securityNotifications")}</span>
                                <strong>
                                    {settings.securityNotifications
                                        ? t("settings.enabled")
                                        : t("settings.disabled")}
                                </strong>
                            </div>
                        </section>

                        <section className="settings-reset-card">
                            <span className="settings-reset-card__icon">
                                <RotateCcw size={19} />
                            </span>

                            <h3>{t("settings.resetTitle")}</h3>
                            <p>{t("settings.resetDescription")}</p>

                            {!resetting ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="md"
                                    className="settings-reset-button"
                                    onClick={() => setResetting(true)}
                                    startIcon={<RotateCcw size={16} />}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            gap: "2px",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        {t("settings.reset")}
                                        <ChevronRight size={16} />
                                    </span>
                                </Button>
                            ) : (
                                <div className="settings-reset-confirm">
                                    <p>{t("settings.resetConfirm")}</p>

                                    <div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="settings-reset-cancel"
                                            onClick={() => setResetting(false)}
                                        >
                                            {t("common.cancel")}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            className="settings-reset-confirm__button"
                                            onClick={handleReset}
                                        >
                                            {t("settings.confirm")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}