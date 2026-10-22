
import { useEffect } from "react";
import { X } from "lucide-react";
import "./ui.css";

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    eyebrow,
    children,
    footer,
    size = "md",
    closeOnOverlay = true,
    closeOnEscape = true,
    showCloseButton = true,
    isLoading = false,
}) {
    useEffect(() => {
        if (!isOpen || !closeOnEscape || isLoading) return;

        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose?.();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, closeOnEscape, isLoading, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    function handleOverlayClick(event) {
        if (
            closeOnOverlay &&
            event.target === event.currentTarget &&
            !isLoading
        ) {
            onClose?.();
        }
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={handleOverlayClick}
        >
            <section
                className={`modal modal--${size}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                {(title || description || eyebrow || showCloseButton) && (
                    <header className="modal__header">
                        <div className="modal__heading">
                            {eyebrow && (
                                <span className="modal__eyebrow">
                                    {eyebrow}
                                </span>
                            )}

                            {title && (
                                <h2 className="modal__title">
                                    {title}
                                </h2>
                            )}

                            {description && (
                                <p className="modal__description">
                                    {description}
                                </p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                type="button"
                                className="modal__close"
                                onClick={onClose}
                                disabled={isLoading}
                                aria-label="Đóng cửa sổ"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </header>
                )}

                <div className="modal__body">
                    {children}
                </div>

                {footer && (
                    <footer className="modal__footer">
                        {footer}
                    </footer>
                )}
            </section>
        </div>
    );
}