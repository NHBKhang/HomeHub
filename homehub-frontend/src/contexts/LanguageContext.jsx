
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import i18n from "../i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(
        i18n.resolvedLanguage || i18n.language || "vi"
    );

    useEffect(() => {
        const handleLanguageChanged = (nextLanguage) => {
            setLanguageState(nextLanguage);
        };

        i18n.on("languageChanged", handleLanguageChanged);

        return () => {
            i18n.off("languageChanged", handleLanguageChanged);
        };
    }, []);

    const setLanguage = useCallback(async (nextLanguage) => {
        if (!["vi", "en"].includes(nextLanguage)) {
            return;
        }

        await i18n.changeLanguage(nextLanguage);

        try {
            localStorage.setItem("homehub-language", nextLanguage);
        } catch { }
    }, []);

    return (
        <LanguageContext.Provider
            value={{ language, setLanguage }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage phải được sử dụng bên trong LanguageProvider."
        );
    }

    return context;
}