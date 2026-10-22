
import { useEffect } from "react";
import {
    AlertCircle,
    CheckCircle2,
    Info,
    X,
} from "lucide-react";
import "./ui.css";

const messageVariants = {
    danger: {
        icon: AlertCircle,
        role: "alert",
    },
    info: {
        icon: Info,
        role: "status",
    },
    success: {
        icon: CheckCircle2,
        role: "status",
    },
};

export default function Message({
    variant = "info",
    title,
    children,
    message,
    className = "",
    onClose,
    showIcon = true,
    duration = 10000,
}) {
    const currentVariant = messageVariants[variant]
        ? variant
        : "info";

    const config = messageVariants[currentVariant];
    const Icon = config.icon;
    const content = children ?? message;

    useEffect(() => {
        if (!content || !onClose || duration <= 0) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [content, onClose, duration]);

    if (!content && !title) return null;

    return (
        <div
            className={[
                "ui-message",
                `ui-message--${currentVariant}`,
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            role={config.role}
            aria-live={config.role === "alert" ? "assertive" : "polite"}
        >
            {showIcon && (
                <Icon
                    className="ui-message__icon"
                    size={19}
                    aria-hidden="true"
                />
            )}

            <div className="ui-message__content">
                {title && (
                    <p className="ui-message__title">
                        {title}
                    </p>
                )}

                {content && (
                    <div className="ui-message__text">
                        {content}
                    </div>
                )}
            </div>

            {onClose && (
                <button
                    type="button"
                    className="ui-message__close"
                    onClick={onClose}
                    aria-label="Đóng thông báo"
                >
                    <X size={17} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}