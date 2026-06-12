def parse_search_req(
        payload,
        current_user=None
):
    page = payload.get(
        "page",
        1
    )

    per_page = payload.get(
        "per_page",
        20
    )

    search = payload.get(
        "search"
    )

    sort_by = payload.get(
        "sort_by",
        "cr_on"
    )

    sort_order = payload.get(
        "sort_order",
        "desc"
    )

    filters = payload.get(
        "filters",
        {}
    )

    #
    # Optional role-based filtering
    #
    if current_user:

        role_code = (
        current_user.role.code
        if current_user.role
        else None
    )

    if role_code == "CREATOR":
        filters.setdefault("creator_id", current_user.id)

    return (
        page,
        per_page,
        search,
        sort_by,
        sort_order,
        filters
    )