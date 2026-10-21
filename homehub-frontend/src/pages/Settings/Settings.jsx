
import { useState } from "react";
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
        <div
            className={`settings-row${last ? " settings-row--last" : ""}`}
        >
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

    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState(defaultSettings);
    const [saved, setSaved] = useState(false);
    const [resetting, setResetting] = useState(false);

    function updateSetting(key, value) {
        setSettings((current) => ({
            ...current,
            [key]: value,
        }));

        setSaved(false);
    }

    function handleSave() {
        setSaved(true);
    }

    function handleReset() {
        setSettings({ ...defaultSettings });
        setSaved(false);
        setResetting(false);
    }

    return (
        <main className="settings-page">
            <div className="settings-container">
                <header className="settings-heading">
                    <div>
                        <h1>Cài đặt</h1>
                        <p>
                            Tùy chỉnh trải nghiệm và cách HomeHub hoạt động
                            theo nhu cầu của bạn.
                        </p>
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
                        {saved ? "Đã xác nhận" : "Lưu cài đặt"}
                    </Button>
                </header>

                {saved && (
                    <div className="settings-notice" role="status">
                        <Check size={18} />
                        <span>
                            Cài đặt đã được xác nhận trong phiên hiện tại.
                            Kết nối API để lưu lâu dài.
                        </span>
                    </div>
                )}

                <div className="settings-layout">
                    <div className="settings-main">
                        <SettingsSection
                            icon={Palette}
                            title="Giao diện"
                            description="Điều chỉnh cách HomeHub hiển thị."
                        >
                            <SettingsRow
                                icon={Sun}
                                title="Chủ đề"
                                description="Chọn giao diện phù hợp với bạn."
                            >
                                <div className="settings-segmented">
                                    <button
                                        type="button"
                                        className={
                                            settings.theme === "light"
                                                ? "is-selected"
                                                : ""
                                        }
                                        onClick={() => {
                                            toggleTheme();
                                            updateSetting("theme", "light")
                                        }}
                                    >
                                        <Sun size={15} />
                                        Sáng
                                    </button>

                                    <button
                                        type="button"
                                        className={
                                            settings.theme === "dark"
                                                ? "is-selected"
                                                : ""
                                        }
                                        onClick={() => {
                                            toggleTheme();
                                            updateSetting("theme", "dark");
                                        }}
                                        aria-label={
                                            theme === "dark"
                                                ? "Chuyển sang giao diện sáng"
                                                : "Chuyển sang giao diện tối"
                                        }
                                        title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
                                    >
                                        <Moon size={15} />
                                        Tối
                                    </button>
                                </div>
                            </SettingsRow>

                            <SettingsRow
                                icon={Monitor}
                                title="Chế độ gọn"
                                description="Giảm khoảng cách để hiển thị nhiều nội dung hơn."
                            >
                                <SettingsToggle
                                    label="Chế độ gọn"
                                    checked={settings.compactMode}
                                    onChange={(value) =>
                                        updateSetting("compactMode", value)
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Languages}
                                title="Ngôn ngữ"
                                description="Ngôn ngữ hiển thị của ứng dụng."
                                last
                            >
                                <select
                                    className="settings-select"
                                    value={settings.language}
                                    onChange={(event) =>
                                        updateSetting(
                                            "language",
                                            event.target.value
                                        )
                                    }
                                    aria-label="Ngôn ngữ"
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </SettingsRow>
                        </SettingsSection>

                        <SettingsSection
                            icon={Bell}
                            title="Thông báo"
                            description="Chọn những sự kiện bạn muốn nhận thông báo."
                        >
                            <SettingsRow
                                icon={Wifi}
                                title="Trạng thái thiết bị"
                                description="Thông báo khi thiết bị kết nối hoặc mất kết nối."
                            >
                                <SettingsToggle
                                    label="Thông báo trạng thái thiết bị"
                                    checked={settings.deviceNotifications}
                                    onChange={(value) =>
                                        updateSetting(
                                            "deviceNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={ShieldCheck}
                                title="Cảnh báo bảo mật"
                                description="Thông báo về hoạt động bảo mật quan trọng."
                            >
                                <SettingsToggle
                                    label="Cảnh báo bảo mật"
                                    checked={settings.securityNotifications}
                                    onChange={(value) =>
                                        updateSetting(
                                            "securityNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Bell}
                                title="Thông báo hệ thống"
                                description="Nhận thông tin về bảo trì và cập nhật."
                            >
                                <SettingsToggle
                                    label="Thông báo hệ thống"
                                    checked={settings.systemNotifications}
                                    onChange={(value) =>
                                        updateSetting(
                                            "systemNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingsRow>

                            <SettingsRow
                                icon={Volume2}
                                title="Âm thanh"
                                description="Phát âm thanh khi có thông báo."
                                last
                            >
                                <SettingsToggle
                                    label="Âm thanh thông báo"
                                    checked={settings.soundEnabled}
                                    onChange={(value) =>
                                        updateSetting("soundEnabled", value)
                                    }
                                />
                            </SettingsRow>
                        </SettingsSection>

                        <SettingsSection
                            icon={ShieldCheck}
                            title="Quyền riêng tư"
                            description="Kiểm soát thông tin hiển thị trên giao diện."
                        >
                            <SettingsRow
                                icon={Monitor}
                                title="Hiển thị trạng thái thiết bị"
                                description="Cho phép hiển thị trạng thái trực tuyến trên trang tổng quan."
                                last
                            >
                                <SettingsToggle
                                    label="Hiển thị trạng thái thiết bị"
                                    checked={settings.showDeviceStatus}
                                    onChange={(value) =>
                                        updateSetting(
                                            "showDeviceStatus",
                                            value
                                        )
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

                            <h2>Trải nghiệm của bạn</h2>
                            <p>
                                Tùy chỉnh HomeHub để quản lý thiết bị thông
                                minh thuận tiện hơn.
                            </p>

                            <div className="settings-summary__divider" />

                            <div className="settings-summary__item">
                                <span>Ngôn ngữ</span>
                                <strong>
                                    {settings.language === "vi"
                                        ? "Tiếng Việt"
                                        : "English"}
                                </strong>
                            </div>

                            <div className="settings-summary__item">
                                <span>Giao diện</span>
                                <strong>
                                    {settings.theme === "light"
                                        ? "Sáng"
                                        : "Tối"}
                                </strong>
                            </div>

                            <div className="settings-summary__item">
                                <span>Thông báo bảo mật</span>
                                <strong>
                                    {settings.securityNotifications
                                        ? "Đang bật"
                                        : "Đang tắt"}
                                </strong>
                            </div>
                        </section>

                        <section className="settings-reset-card">
                            <span className="settings-reset-card__icon">
                                <RotateCcw size={19} />
                            </span>

                            <h3>Khôi phục mặc định</h3>
                            <p>
                                Đưa các tùy chọn trên trang này về giá trị
                                ban đầu.
                            </p>

                            {!resetting ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="md"
                                    className="settings-reset-button"
                                    onClick={() => setResetting(true)}
                                    startIcon={<RotateCcw size={16} />}
                                >
                                    <span style={{ display: "flex", gap: "2px", justifyContent: "center", alignItems: "center" }}>
                                        Khôi phục cài đặt
                                        <ChevronRight size={16} />
                                    </span>
                                </Button>
                            ) : (
                                <div className="settings-reset-confirm">
                                    <p>Bạn muốn khôi phục tất cả cài đặt?</p>

                                    <div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="settings-reset-cancel"
                                            onClick={() => setResetting(false)}
                                        >
                                            Hủy
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            className="settings-reset-confirm__button"
                                            onClick={handleReset}
                                        >
                                            Xác nhận
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