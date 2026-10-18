import { useNavigate } from "react-router-dom";
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

    return (
        <main className="not-found">
            <div className="not-found__content">
                <div className="not-found__illustration" aria-hidden="true">
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
                    LỖI 404
                </span>

                <h1>
                    Có vẻ bạn đã
                    <br />
                    <span>đi lạc rồi!</span>
                </h1>

                <p className="not-found__description">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                    Đừng lo, hãy quay về và tiếp tục quản lý ngôi nhà của bạn nhé.
                </p>

                <div className="not-found__actions">
                    <button
                        type="button"
                        className="not-found__button not-found__button--primary"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        <House size={18} />
                        Về trang tổng quan
                        <ArrowRight size={17} />
                    </button>

                    <button
                        type="button"
                        className="not-found__button not-found__button--secondary"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={17} />
                        Quay lại
                    </button>
                </div>

                <div className="not-found__footer">
                    <span className="not-found__footer-icon">
                        <House size={15} />
                    </span>
                    <span>
                        <strong>HomeHub</strong>
                        <span className="not-found__footer-divider">·</span>
                        Smart living, made simple.
                    </span>
                </div>
            </div>
        </main>
    );
}