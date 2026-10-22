import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import vi from "./locales/vi.json";
import en from "./locales/en.json";

const LANGUAGE_KEY = "homehub-language";
const SUPPORTED_LANGUAGES = ["vi", "en"];

function getInitialLanguage() {
    try {
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

        return SUPPORTED_LANGUAGES.includes(savedLanguage)
            ? savedLanguage
            : "vi";
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
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

i18n.on("languageChanged", (language) => {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
        return;
    }

    try {
        localStorage.setItem(LANGUAGE_KEY, language);
    } catch {
        // Bỏ qua nếu trình duyệt không cho phép lưu localStorage.
    }
});

export default i18n;