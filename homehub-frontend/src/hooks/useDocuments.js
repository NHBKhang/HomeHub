import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageTitles = {
    "/": "Tổng quan",
    "/devices": "Thiết bị",
    "/tasks": "Công việc",
    "/expenses": "Chi tiêu",
    "/settings": "Cài đặt",
    "/login": "Đăng nhập",
    "/register": "Đăng ký",
};

export default function useDocumentTitle() {
    const { pathname } = useLocation();

    useEffect(() => {
        const pageTitle = pageTitles[pathname] || "Không tìm thấy trang";
        document.title = `${pageTitle} | HomeHub`;
    }, [pathname]);
}