import "./FilterGroup.css";

export default function FilterGroup({
    filters = [],
    value,
    onChange,
    variant = "tabs",
    className = "",
    disabled = false,
}) {
    if (variant === "select") {
        return (
            <div className={`filter-group-select ${className}`}>
                <select
                    value={value}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.value)}
                >
                    {filters.map((filter) => (
                        <option
                            key={filter.value}
                            value={filter.value}
                            disabled={filter.disabled}
                        >
                            {filter.label}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div className={`filter-group ${className}`}>
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    type="button"
                    className={
                        value === filter.value ? "active" : ""
                    }
                    disabled={disabled || filter.disabled}
                    onClick={() => onChange?.(filter.value)}
                >
                    {filter.label}

                    {filter.count !== undefined && (
                        <span className="filter-count">
                            {filter.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}