import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ArrowLeft,
    ArrowRight,
    House,
    Search,
} from "lucide-react";

import "./NotFound.css";
import useDocumentTitle from "../../hooks/useDocuments";

export default function NotFound() {
    useDocumentTitle();

    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <main className="not-found">
            <div className="not-found__content">
                <div
                    className="not-found__illustration"
                    aria-hidden="true"
                >
                    <div className="not-found__orbit not-found__orbit--one" />
                    <div className="not-found__orbit not-found__orbit--two" />

                    <div className="not-found__icon">
                        <Search size={54} strokeWidth={1.5} />
                    </div>

                    <span className="not-found__number">404</span>
                    <span className="not-found__spark not-found__spark--one" />
                    <span className="not-found__spark not-found__spark--two" />
                    <span className="not-found__spark not-found__spark--three" />
                </div>

                <span className="not-found__eyebrow">
                    <span className="not-found__status-dot" />
                    {t("notFound.eyebrow")}
                </span>

                <h1>
                    {t("notFound.titleLine1")}
                    <br />
                    <span>{t("notFound.titleLine2")}</span>
                </h1>

                <p className="not-found__description">
                    {t("notFound.description")}
                </p>

                <div className="not-found__actions">
                    <button
                        type="button"
                        className="not-found__button not-found__button--primary"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        <House size={18} />
                        {t("notFound.homeButton")}
                        <ArrowRight size={17} />
                    </button>

                    <button
                        type="button"
                        className="not-found__button not-found__button--secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={17} />
                        {t("notFound.backButton")}
                    </button>
                </div>

                <div className="not-found__footer">
                    <span className="not-found__footer-icon">
                        <House size={15} />
                    </span>

                    <span>
                        <strong>HomeHub</strong>
                        <span className="not-found__footer-divider">·</span>
                        {t("notFound.tagline")}
                    </span>
                </div>
            </div>
        </main>
    );
}