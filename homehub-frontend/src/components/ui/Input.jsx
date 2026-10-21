
import { useId } from "react";
import "./ui.css";

export default function Input({
    label,
    error,
    hint,
    id,
    className = "",
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const describedBy = [
        hint ? hintId : null,
        error ? errorId : null,
        props["aria-describedby"],
    ].filter(Boolean).join(" ") || undefined;

    return (
        <div className={`ui-field ${className}`.trim()}>
            {label && (
                <label className="ui-label" htmlFor={inputId}>
                    {label}
                </label>
            )}

            <input
                {...props}
                id={inputId}
                className={`ui-input ${error ? "ui-input--error" : ""}`}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
            />

            {hint && !error && (
                <span className="ui-hint" id={hintId}>
                    {hint}
                </span>
            )}

            {error && (
                <span className="ui-error" id={errorId} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}