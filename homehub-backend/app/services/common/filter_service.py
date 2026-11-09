from sqlalchemy.orm import Query


def apply_filters(
    query: Query,
    filters: dict | None,
    allowed_filters: dict,
):
    if not filters:
        return query

    for field, value in filters.items():
        column = allowed_filters.get(field)

        if column is None or value is None:
            continue

        if isinstance(value, list):
            query = query.filter(column.in_(value))
        else:
            query = query.filter(column == value)

    return query