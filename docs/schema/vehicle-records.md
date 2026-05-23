# Vehicle Records Schema

## Purpose

The vehicle records schema stores vehicle master data, vehicle kilometer trips, and fuel purchase records.

This schema is scoped to the vehicle management module. It keeps the master vehicle list small and stores trip and fuel records separately because they are entered by different teams and describe different business events.

## Tables

```txt
VEHICLES
- id
- vehicle_name
- is_active
- created_at
- updated_at

VEHICLE_KM_RECORDS
- id
- vehicle_id
- trip_date
- driver_name
- trip_purpose
- departure_time
- departure_odometer
- arrival_time
- arrival_odometer
- note
- created_at
- updated_at

FUEL_RECORDS
- id
- vehicle_id
- fuel_date
- unit_price
- liters
- note
- created_at
- updated_at
```

## VEHICLES Columns

| Column | Meaning | Notes |
| --- | --- | --- |
| `id` | Primary key | Auto-generated numeric identifier. |
| `vehicle_name` | Vehicle display name | Example values: `19C`, `6T HINO`, `PICKUP`. |
| `is_active` | Active status | Uses `1` for active and `0` for inactive. |
| `created_at` | Creation timestamp | Set when the vehicle is created. |
| `updated_at` | Last update timestamp | Updated when the vehicle changes. |

## VEHICLE_KM_RECORDS Columns

| Column | Meaning | Notes |
| --- | --- | --- |
| `id` | Primary key | Auto-generated numeric identifier. |
| `vehicle_id` | Vehicle reference | References `VEHICLES.id`. |
| `trip_date` | Trip date | Comes from the date column in `KM_xe.xlsx`. |
| `driver_name` | Driver name | Comes from the driver column in `KM_xe.xlsx`. |
| `trip_purpose` | Trip description | Comes from the trip content column in `KM_xe.xlsx`. |
| `departure_time` | Departure time | Comes from the departure time column in `KM_xe.xlsx`. |
| `departure_odometer` | Departure odometer reading | Comes from the departure odometer column in `KM_xe.xlsx`. |
| `arrival_time` | Arrival time | Comes from the arrival time column in `KM_xe.xlsx`. |
| `arrival_odometer` | Arrival odometer reading | Comes from the arrival odometer column in `KM_xe.xlsx`. |
| `note` | Optional note | Comes from the note column in `KM_xe.xlsx`. |
| `created_at` | Creation timestamp | Set when the record is created. |
| `updated_at` | Last update timestamp | Updated when the record changes. |

## FUEL_RECORDS Columns

| Column | Meaning | Notes |
| --- | --- | --- |
| `id` | Primary key | Auto-generated numeric identifier. |
| `vehicle_id` | Vehicle reference | References `VEHICLES.id`. |
| `fuel_date` | Fuel purchase date | Comes from the date column in the fuel workbook. |
| `unit_price` | Fuel unit price | Integer VND amount from the price column in the fuel workbook. |
| `liters` | Fuel volume | Comes from the liters column in the fuel workbook. |
| `note` | Optional note | Used for invoice notes or manual clarification. |
| `created_at` | Creation timestamp | Set when the record is created. |
| `updated_at` | Last update timestamp | Updated when the record changes. |

## Design Decisions

- `VEHICLES` is kept intentionally small because the current source files only provide a vehicle label.
- `vehicle_name` is used instead of separate `vehicle_code` and `vehicle_name` fields because the current source data does not have a separate official vehicle code.
- `VEHICLE_KM_RECORDS` and `FUEL_RECORDS` are separate tables because kilometer trips are entered by security while fuel records are entered by general affairs.
- `distance_km` is not stored because it can be calculated as `arrival_odometer - departure_odometer`.
- `total_amount` is not stored because it can be calculated as `unit_price * liters`.
- Dashboard values such as `km_per_liter` and `cost_per_km` should be calculated in report queries or API responses instead of duplicated in the tables.

## Suggested Constraints

- `vehicle_name` should be required and unique.
- `is_active` should be required and limited to `0` or `1`.
- `vehicle_id` should be required in both record tables.
- `trip_date` should be required for kilometer records.
- `departure_odometer` and `arrival_odometer` should be required integer values and greater than or equal to `0`.
- `arrival_odometer` should be greater than or equal to `departure_odometer`.
- `fuel_date` should be required for fuel records.
- `unit_price` should be a required integer value and greater than or equal to `0`.
- `liters` should be required and greater than or equal to `0`.
