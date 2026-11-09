import "./DataTable.css";

export default function DataTable({
    columns = [],
    data = [],
    rowKey = "id",

    // Trạng thái
    loading = false,
    error = "",
    emptyMessage = "Không có dữ liệu.",
    loadingRows = 5,

    // Pagination
    pagination = false,
    page = 1,
    pageSize = 10,
    total = 0,
    totalPages = 0,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],

    // Tùy chỉnh
    className = "",
    showFooter = true,
    showPageSize = true,
}) {
    const getRowKey = (row, index) => {
        if (typeof rowKey === "function") {
            return rowKey(row, index);
        }

        return row[rowKey] ?? index;
    };

    const getCellValue = (column, row, index) => {
        if (column.render) {
            return column.render(row, index);
        }

        if (column.accessor) {
            return typeof column.accessor === "function"
                ? column.accessor(row)
                : row[column.accessor];
        }

        return row[column.key];
    };

    const handlePageChange = (nextPage) => {
        if (
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === page ||
            loading
        ) {
            return;
        }

        onPageChange?.(nextPage);
    };

    const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className={`data-table-container ${className}`}>
            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={column.headerClassName || column.className || ""}
                                    style={{
                                        textAlign: column.align || "left",
                                        width: column.width,
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: loadingRows }).map((_, index) => (
                                <tr key={`loading-${index}`}>
                                    <td colSpan={columns.length}>
                                        <div className="data-table-loading">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <div className="data-table-empty">
                                        {error}
                                    </div>
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <div className="data-table-empty">
                                        {emptyMessage}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.map((row, index) => (
                                <tr key={getRowKey(row, index)}>
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className={column.className || ""}
                                            style={{
                                                textAlign: column.align || "left",
                                                width: column.width,
                                            }}
                                        >
                                            {getCellValue(column, row, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && showFooter && (
                <div className="data-table-footer">
                    <div className="data-table-footer-info">
                        <span>
                            Hiển thị {startItem}–{endItem} / {total} bản ghi
                        </span>

                        {showPageSize && onPageSizeChange && (
                            <select
                                value={pageSize}
                                disabled={loading}
                                onChange={(e) => {
                                    onPageSizeChange(Number(e.target.value));
                                }}
                                aria-label="Số bản ghi mỗi trang"
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size} / trang
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="data-table-pagination">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => handlePageChange(1)}
                            aria-label="Trang đầu"
                        >
                            «
                        </button>

                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Trước
                        </button>

                        <span>
                            Trang <strong>{page}</strong> / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Tiếp
                        </button>

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() => handlePageChange(totalPages)}
                            aria-label="Trang cuối"
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}