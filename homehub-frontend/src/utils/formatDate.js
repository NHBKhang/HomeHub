export default function formatDate(value, language = "vi") {
    if (!value) {
        return language === "en" ? "Not updated" : "Chưa cập nhật";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return language === "en" ? "Not updated" : "Chưa cập nhật";
    }

    return new Intl.DateTimeFormat(
        language === "en" ? "en-US" : "vi-VN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    ).format(date);
}