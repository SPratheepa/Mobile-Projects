from config.database import db
import math

from typing import List, Dict, Any
from sqlalchemy import ARRAY, Boolean, Date, DateTime, Float, Integer, String, Text, cast, or_, desc, asc
from sqlalchemy.engine import Row


class BaseRepository:

    def __init__(self, model):
        self.model = model

    def get_by_id(self, id):

        return self.model.query.filter(
            self.model.id == id,
            self.model.is_deleted == False
        ).first()

    def create(self, obj):

        db.session.add(obj)

        db.session.commit()

        db.session.refresh(obj)

        return obj

    def update(self):

        db.session.commit()

    def delete(self, obj):

        obj.is_deleted = True

        db.session.commit()

    def get_all(self):

        return self.model.query.filter(
            self.model.is_deleted == False
        ).all()
    
    # -------------------------------------------------------------------------
    # 📄 Pagination, Filtering, and Search
    # -------------------------------------------------------------------------

    def paginate(
    self,
    page: int = 1,
    per_page: int = 20,
    sort_by: str = "id",
    sort_order: str = "asc",
    filters: Dict[str, Any] = None,
    search_term: str = None,
    search_fields: List[str] = None,
    query=None,dict_method="to_dict"
) -> Dict[str, Any]:

        if query is None:
            query = self.model.query

        filters = filters or {}

        # -------------------------------------------------
        # Cache model column metadata (BIG win)
        # -------------------------------------------------
        columns = {
            c.name: c for c in self.model.__table__.columns
        }

        # -------------------------------------------------
        # FILTERS
        # -------------------------------------------------
        for key, value in filters.items():
            if (
                key in ("between", "between_fields")
                or value in (None, "", [])
                or key not in columns
            ):
                continue

            column = columns[key]
            col_type = type(column.type)

            # NULL checks
            if isinstance(value, dict):
                if value.get("not_null"):
                    query = query.filter(column.isnot(None))
                    continue
                if value.get("is_null"):
                    query = query.filter(column.is_(None))
                    continue

            # ARRAY
            if isinstance(column.type, ARRAY):
                vals = value if isinstance(value, (list, tuple)) else [value]
                query = query.filter(column.contains(list(vals)))
                continue

            # IN
            if isinstance(value, (list, tuple, set)):
                query = query.filter(column.in_(value))
                continue

            # Comma separated
            if isinstance(value, str) and "," in value:
                query = query.filter(column.in_([v.strip() for v in value.split(",")]))
                continue

            # TEXT
            if issubclass(col_type, (String, Text)):
                query = query.filter(column.ilike(f"%{value}%"))
                continue

            # NUMERIC
            if issubclass(col_type, (Integer, Float)):
                try:
                    query = query.filter(column == float(value))
                except ValueError:
                    pass
                continue

            # BOOLEAN
            if issubclass(col_type, Boolean):
                val = str(value).lower()
                if val in ("1", "true", "yes"):
                    query = query.filter(column.is_(True))
                elif val in ("0", "false", "no"):
                    query = query.filter(column.is_(False))
                continue

            # DATE / DATETIME
            if issubclass(col_type, (Date, DateTime)):
                try:
                    from dateutil.parser import parse
                    query = query.filter(column == parse(str(value)))
                except Exception:
                    pass
                continue

            # JSON / JSONB
            if col_type.__name__ in ("JSON", "JSONB"):
                if isinstance(value, dict) and {"key", "value"} <= value.keys():
                    query = query.filter(
                        cast(column[value["key"]], String).ilike(f"%{value['value']}%")
                    )
                else:
                    query = query.filter(cast(column, String).ilike(f"%{value}%"))
                continue

            # Fallback
            query = query.filter(column == value)

        # -------------------------------------------------
        # BETWEEN filters
        # -------------------------------------------------
        for field, rule in filters.get("between", {}).items():
            if field in columns:
                if rule.get("min") is not None:
                    query = query.filter(columns[field] >= rule["min"])
                if rule.get("max") is not None:
                    query = query.filter(columns[field] <= rule["max"])

        for rule in filters.get("between_fields", {}).values():
            f1, f2 = rule.get("from_field"), rule.get("to_field")
            if f1 in columns and f2 in columns:
                if rule.get("filter_from") is not None:
                    query = query.filter(columns[f1] >= rule["filter_from"])
                if rule.get("filter_to") is not None:
                    query = query.filter(columns[f2] <= rule["filter_to"])

        # -------------------------------------------------
        # SEARCH
        # -------------------------------------------------
        if search_term:
            search_cols = []

            if search_fields:
                for f in search_fields:
                    if isinstance(f, str) and f in columns:
                        search_cols.append(columns[f])
                    elif hasattr(f, "ilike"):
                        search_cols.append(f)
            else:
                for c in columns.values():
                    if isinstance(c.type, (String, Text)):
                        search_cols.append(c)
                    elif type(c.type).__name__ in ("JSON", "JSONB"):
                        search_cols.append(cast(c, String))

            if search_cols:
                query = query.filter(
                    or_(*[c.ilike(f"%{search_term}%") for c in search_cols])
                )

        # -------------------------------------------------
        # SORTING
        # -------------------------------------------------
        sort_col = columns.get(sort_by)
        if sort_col is not None:
            query = query.order_by(
                desc(sort_col) if sort_order.lower() == "desc" else asc(sort_col)
            )

        # -------------------------------------------------
        # PAGINATION
        # -------------------------------------------------
        page = max(int(page or 1), 1)
        per_page = max(int(per_page or 20), 1)

        paginated = query.paginate(page=page, per_page=per_page, error_out=False)

        pagination = {
            "total": paginated.total,
            "limit": per_page,
            "offset": (page - 1) * per_page,
            "pages": math.ceil(paginated.total / per_page),
        }

        # -------------------------------------------------
        # SERIALIZATION (JOIN SAFE, SIMPLIFIED)
        # -------------------------------------------------
        def serialize(row, dict_method="to_dict"):
            if hasattr(row, dict_method):
                return row.to_dict(include_audit=True)

            if isinstance(row, Row):
                data = {}
                for k, v in row._mapping.items():
                    if hasattr(v, dict_method):
                        #data.update(v.to_dict(include_audit=True))
                         data.update(
                                        getattr(v, dict_method)(include_audit=True)
                                    )
                    else:
                        data[k] = v
                return data

            return row

        return [serialize(r,dict_method) for r in paginated.items], pagination
