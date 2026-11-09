import { Search, X } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar({
    value = "",
    onChange,
    placeholder = "Tìm kiếm...",
    className = "",
    disabled = false,
    showClear = true,
}) {
    return (
        <div className={`search-bar ${className}`}>
            <Search size={18} className="search-bar-icon" />

            <input
                type="text"
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
            />

            {showClear && value && (
                <button
                    type="button"
                    className="search-bar-clear"
                    onClick={() => onChange?.("")}
                    disabled={disabled}
                    aria-label="Xóa tìm kiếm"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
