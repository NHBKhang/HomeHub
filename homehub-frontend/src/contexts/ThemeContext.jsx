
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
    try {
        return localStorage.getItem("homehub-theme") === "dark"
            ? "dark"
            : "light";
    } catch {
        return "light";
    }
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        try {
            localStorage.setItem("homehub-theme", theme);
        } catch {
            // Bỏ qua nếu trình duyệt không cho phép lưu.
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) =>
            current === "light" ? "dark" : "light"
        );
    }, []);

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme phải được sử dụng bên trong ThemeProvider."
        );
    }

    return context;
}