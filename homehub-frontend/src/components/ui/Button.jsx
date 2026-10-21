import "./ui.css";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    loading = false,
    disabled = false,
    outline = false,
    startIcon,
    className = "",
    ...props
}) {
    const buttonVariant = outline ? "outline" : variant;

    return (
        <button
            type={type}
            className={[
                "ui-button",
                `ui-button--${variant}`,
                outline ? "ui-button--outline" : "",
                `ui-button--${size}`,
                className,
            ].filter(Boolean).join(" ")}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading ? (
                <span className="ui-spinner" aria-hidden="true" />
            ) : (
                startIcon
            )}

            <span>{children}</span>
        </button>
    );
}