
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Users as UsersIcon,
    UserCheck,
    UserX,
    ShieldCheck,
} from "lucide-react";
import "./Users.css";
import formatDate from "../../../utils/formatDate";
import userService from "../../../services/userSerivce";
import StatCard from "../../../components/admin/StatCard/StatCard";
import DataTable from "../../../components/admin/StatCard/DataTable/DataTable";
import Button from "../../../components/ui/Button";
import FilterGroup from "../../../components/admin/FilterGroup/FilterGroup";
import SearchBar from "../../../components/admin/Searchbar/Searchbar";
import useDocumentTitle from "../../../hooks/useDocuments";
import { useTranslation } from "react-i18next";

export default function Users() {
    useDocumentTitle();

    const { t } = useTranslation();

    const [data, setData] = useState({
        items: [],
        total: 0,
        page: 1,
        page_size: 10,
        total_pages: 0,
        statistics: {
            total: 0,
            active: 0,
            inactive: 0,
            admins: 0,
        },
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filters = [
        { value: "all", label: t("users.filters.all") },
        { value: "active", label: t("users.active") },
        { value: "inactive", label: t("users.inactive") },
    ];

    const columns = [
        {
            key: "user",
            title: t("users.table.user"),
            render: (user) => (
                <div className="users-identity">
                    <div className="users-avatar">
                        {(user.first_name || user.username || "U")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user.full_name ||
                                `${user.last_name || ""} ${user.first_name || ""}`.trim() ||
                                user.username}
                        </strong>
                        <span>@{user.username}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "email",
            title: "Email",
        },
        {
            key: "role",
            title: t("users.table.role"),
            render: (user) => (
                <span
                    className={`users-role ${user.is_superuser ? "admin" : "member"
                        }`}
                >
                    {user.is_superuser
                        ? t("users.roles.admin")
                        : t("users.roles.member")}
                </span>
            ),
        },
        {
            key: "status",
            title: t("table.status"),
            render: (user) => (
                <span
                    className={`users-status ${user.is_active ? "active" : "inactive"
                        }`}
                >
                    <span className="status-dot" />
                    {user.is_active
                        ? t("users.active")
                        : t("users.inactive")}
                </span>
            ),
        },
        {
            key: "created_at",
            title: t("table.createdAt"),
            render: (user) => formatDate(user.created_at),
        },
    ];

    // Load users from backend
    const loadData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const filters = {};

            if (filter === "active") {
                filters.is_active = true;
            } else if (filter === "inactive") {
                filters.is_active = false;
            }

            const result = await userService.getUsers({
                page,
                page_size: pageSize,
                kw: search.trim() || undefined,
                filters,
            });

            setData(result);
        } catch (error) {
            setError(
                error.message || t("users.errors.loadFailed")
            );
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, search, filter, t]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Statistics
    const statisticsItems = [
        {
            title: t("users.statistics.total"),
            value: data.statistics?.total ?? 0,
            icon: UsersIcon,
            color: "purple",
        },
        {
            title: t("users.active"),
            value: data.statistics?.active ?? 0,
            icon: UserCheck,
            color: "green",
        },
        {
            title: t("users.inactive"),
            value: data.statistics?.inactive ?? 0,
            icon: UserX,
            color: "red",
        },
        {
            title: t("users.statistics.admins"),
            value: data.statistics?.admins ?? 0,
            icon: ShieldCheck,
            color: "blue",
        },
    ];

    return (
        <main className="users-page">
            <div className="users-container">
                {/* Header */}
                <header className="users-heading">
                    <div>
                        <h1>{t("users.title")}</h1>
                        <p>{t("users.description")}</p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        className="users-action-button"
                        startIcon={<RefreshCw size={17} />}
                        loading={loading}
                        disabled={loading}
                        onClick={loadData}
                    >
                        {loading
                            ? t("common.loading")
                            : t("common.refresh")}
                    </Button>
                </header>

                {/* Statistics */}
                <div className="summary-statistics">
                    {statisticsItems.map((item) => (
                        <StatCard
                            key={item.title}
                            {...item}
                        />
                    ))}
                </div>

                {/* Users table */}
                <section className="users-table-section">
                    <div className="users-toolbar">
                        <SearchBar
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                                setPage(1);
                            }}
                            placeholder={t("users.searchPlaceholder")}
                        />

                        <FilterGroup
                            filters={filters}
                            value={filter}
                            onChange={(value) => {
                                setFilter(value);
                                setPage(1);
                            }}
                        />
                    </div>

                    {error && (
                        <div className="users-error">
                            <span>{error}</span>
                            <button
                                type="button"
                                onClick={loadData}
                            >
                                {t("common.retry")}
                            </button>
                        </div>
                    )}

                    <DataTable
                        columns={columns}
                        data={data.items}
                        rowKey="id"
                        loading={loading}
                        emptyMessage={
                            search || filter !== "all"
                                ? t("users.empty.filtered")
                                : t("users.empty.default")
                        }
                        pagination
                        page={data.page}
                        pageSize={data.page_size}
                        total={data.total}
                        totalPages={data.total_pages}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => {
                            setPage(1);
                            setPageSize(size);
                        }}
                    />
                </section>
            </div>
        </main>
    );
}