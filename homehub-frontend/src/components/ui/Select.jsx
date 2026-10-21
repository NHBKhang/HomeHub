
import { useId } from "react";
import { ChevronDown } from "lucide-react";
import "./ui.css";

export default function Select({
    label,
    options = [],
    error,
    id,
    className = "",
    placeholder,
    ...props
}) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
        <div className={`ui-field ${className}`.trim()}>
            {label && (
                <label className="ui-label" htmlFor={selectId}>
                    {label}
                </label>
            )}

            <div className="ui-select-wrap">
                <select
                    {...props}
                    id={selectId}
                    className={`ui-select ${error ? "ui-input--error" : ""}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    className="ui-select-icon"
                    size={17}
                    aria-hidden="true"
                />
            </div>

            {error && (
                <span className="ui-error" id={errorId} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}