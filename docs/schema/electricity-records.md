# Electricity Records Schema

## Purpose

`ELECTRICITY_RECORDS` stores monthly electricity usage and cost by location option and department group.

This table is intentionally scoped to the electricity module only. It does not store calculated report values that can be derived from existing records.

## Table

```txt
ELECTRICITY_RECORDS
- id
- record_year
- record_month
- location
- department_group
- kwh_used
- total_cost
- note
- created_at
- updated_at
```

## Columns

| Column | Meaning | Notes |
| --- | --- | --- |
| `id` | Primary key | Auto-generated numeric identifier. |
| `record_year` | Reporting year | Example: `2024`, `2025`. |
| `record_month` | Reporting month | Integer from `1` to `12`. |
| `location` | Fixed location option | Stored directly because the current requirement only has four fixed options. |
| `department_group` | Department or department group | Example values come from the Excel `BO PHAN` column. |
| `kwh_used` | Electricity usage | Comes from the Excel `SO DIEN SU DUNG (KW)` column. |
| `total_cost` | Electricity cost amount | Comes from the Excel `SO TIEN` column. |
| `note` | Optional note | Used for import comments or manual clarification. |
| `created_at` | Creation timestamp | Set when the record is created. |
| `updated_at` | Last update timestamp | Updated when the record changes. |

## Design Decisions

- `location` is stored directly instead of using `location_id` because the current requirement only has four fixed location options.
- `finished_pairs` is not included because the current electricity module does not need cost-per-pair reporting.
- `previous_month_diff` is not stored because it can be calculated from existing monthly records.
- Derived values should be calculated in reporting queries or API responses instead of duplicated in the table.

## Suggested Constraints

- `record_year` should be required.
- `record_month` should be required and limited to `1` through `12`.
- `location` should be required and validated against the four allowed options.
- `department_group` should be required.
- `kwh_used` should be required and greater than or equal to `0`.
- `total_cost` should be required and greater than or equal to `0`.
- A unique rule should prevent duplicate rows for the same `record_year`, `record_month`, `location`, and `department_group`.
