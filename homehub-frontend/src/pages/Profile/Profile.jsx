import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    X,
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

function formatDate(value) {
    if (!value) return "Chưa cập nhật";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Chưa cập nhật";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

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

function ProfileInfo({ icon: Icon, label, value }) {
    return (
        <div className="profile-info">
            <span className="profile-info__icon">
                <Icon size={19} />
            </span>

            <div className="profile-info__content">
                <span className="profile-info__label">{label}</span>
                <span className="profile-info__value">
                    {value || "Chưa cập nhật"}
                </span>
            </div>
        </div>
    );
}

function SecurityItem({
    icon: Icon,
    title,
    description,
    status = "Chưa thiết lập",
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
            showMessage("danger", error.message || "Không thể tải lại thông tin tài khoản.");
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

        if (!payload.first_name || !payload.last_name || !payload.email) {
            showMessage("danger", "Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        setSaving(true);

        try {
            await userService.updateProfile(payload);
            await loadUser();

            setIsEditing(false);
        } catch (error) {
            showMessage("danger", error.message || "Không thể cập nhật thông tin cá nhân.");

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
                <RefreshCw size={22} className="profile-spin" />
                <span>Đang tải hồ sơ...</span>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-container">
                <header className="profile-heading">
                    <div>
                        <h1>Hồ sơ cá nhân</h1>
                        <p>
                            Quản lý thông tin cá nhân và bảo mật HomeHub.
                        </p>
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
                            {refreshing ? "Đang tải..." : "Làm mới"}
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
                            Chỉnh sửa hồ sơ
                        </Button>
                    </div>
                </header>

                {(message?.text || userError) && (
                    <Message
                        variant={message?.text ? message.type : "danger"}
                        onClose={() => setMessage(null)}
                        message={message?.text || userError}
                    />
                )}

                <section className="profile-overview">
                    <div className="profile-avatar">
                        {getInitials(user)}
                    </div>

                    <div className="profile-overview__content">
                        <h2>
                            {user.full_name ||
                                `${user.last_name || ""} ${user.first_name || ""}`.trim() ||
                                user.username}
                        </h2>

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
                                    ? "Đang hoạt động"
                                    : "Đã vô hiệu hóa"}
                            </span>

                            {user.is_superuser && (
                                <span className="profile-badge profile-badge--admin">
                                    <ShieldCheck size={14} />
                                    Quản trị viên
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="profile-member">
                        <span>THÀNH VIÊN TỪ</span>
                        <strong>{formatDate(user.created_at)}</strong>
                    </div>
                </section>

                <div className="profile-grid">
                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span className="profile-card__icon">
                                <UserRound size={20} />
                            </span>

                            <div>
                                <h3>Thông tin cá nhân</h3>
                                <p>Thông tin cơ bản của tài khoản.</p>
                            </div>
                        </div>

                        <div className="profile-info-list">
                            <ProfileInfo
                                icon={UserRound}
                                label="Họ và tên"
                                value={
                                    user.full_name ||
                                    `${user.last_name || ""} ${user.first_name || ""}`.trim()
                                }
                            />

                            <ProfileInfo
                                icon={AtSign}
                                label="Tên đăng nhập"
                                value={user.username}
                            />

                            <ProfileInfo
                                icon={Mail}
                                label="Địa chỉ email"
                                value={user.email}
                            />
                        </div>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card__heading">
                            <span className="profile-card__icon">
                                <ShieldCheck size={20} />
                            </span>

                            <div>
                                <h3>Tài khoản</h3>
                                <p>Trạng thái và thông tin hệ thống.</p>
                            </div>
                        </div>

                        <div className="profile-info-list">
                            <ProfileInfo
                                icon={KeyRound}
                                label="Loại tài khoản"
                                value={
                                    user.is_superuser
                                        ? "Quản trị viên"
                                        : "Người dùng"
                                }
                            />

                            <ProfileInfo
                                icon={CheckCircle2}
                                label="Trạng thái"
                                value={
                                    user.is_active
                                        ? "Đang hoạt động"
                                        : "Đã vô hiệu hóa"
                                }
                            />

                            <ProfileInfo
                                icon={CalendarDays}
                                label="Ngày tạo tài khoản"
                                value={formatDate(user.created_at)}
                            />

                            <ProfileInfo
                                icon={Clock3}
                                label="Cập nhật lần cuối"
                                value={formatDate(user.updated_at)}
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
                            <h3>Bảo mật tài khoản</h3>
                            <p>
                                Các thiết lập giúp bảo vệ tài khoản HomeHub.
                            </p>
                        </div>
                    </div>

                    <div className="profile-security-list">
                        <SecurityItem
                            icon={KeyRound}
                            title="Đổi mật khẩu"
                            description="Cập nhật mật khẩu để bảo vệ tài khoản."
                        />

                        <SecurityItem
                            icon={ShieldCheck}
                            title="Xác thực hai yếu tố (2FA)"
                            description="Thêm một lớp xác minh khi đăng nhập."
                            status="Sắp có"
                        />

                        <SecurityItem
                            icon={Monitor}
                            title="Thiết bị và phiên đăng nhập"
                            description="Xem thiết bị đang đăng nhập và đăng xuất từ xa."
                            status="Sắp có"
                        />

                        <SecurityItem
                            icon={History}
                            title="Lịch sử bảo mật"
                            description="Theo dõi đăng nhập và các thay đổi quan trọng."
                            status="Sắp có"
                        />

                        <SecurityItem
                            icon={Bell}
                            title="Thông báo bảo mật"
                            description="Nhận cảnh báo khi phát hiện hoạt động bất thường."
                            status="Sắp có"
                        />

                        <SecurityItem
                            icon={Smartphone}
                            title="Phương thức khôi phục"
                            description="Chuẩn bị cách lấy lại quyền truy cập tài khoản."
                            status="Sắp có"
                        />
                    </div>

                    <div className="profile-security-note">
                        <ShieldCheck size={18} />
                        <p>
                            Không chia sẻ mật khẩu, token truy cập hoặc dữ liệu
                            xác thực nhạy cảm trên trang hồ sơ.
                        </p>
                    </div>
                </section>

                <section className="profile-logout-card">
                    <div className="profile-logout-card__text">
                        <h3>Đăng xuất khỏi HomeHub</h3>
                        <p>
                            Kết thúc phiên sử dụng trên thiết bị này.
                        </p>
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
                        Đăng xuất
                    </Button>
                </section>

                <Modal
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                    eyebrow="ACCOUNT SETTINGS"
                    title="Chỉnh sửa hồ sơ"
                    description="Cập nhật thông tin cá nhân của bạn."
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
                                Hủy
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
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
                                label="Họ"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                autoComplete="family-name"
                                required
                                disabled={saving}
                                className="profile-edit-form__field"
                            />

                            <Input
                                label="Tên"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Nhập tên"
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