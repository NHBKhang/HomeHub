import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi";
import en from "./locales/en";

function getInitialLanguage() {
    try {
        const savedLanguage = localStorage.getItem("homehub-language");

        return savedLanguage === "en" ? "en" : "vi";
    } catch {
        return "vi";
    }
}

i18n.use(initReactI18next).init({
    resources: {
        vi: { translation: vi },
        en: { translation: en },
    },
    lng: getInitialLanguage(),
    fallbackLng: "vi",
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;