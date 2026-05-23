# UtilityTrack Implementation Log

This document records the implementation work completed so far. It is intended as a concise handoff note, not a full user guide.

## 2026-05-23

### Documentation

- Added electricity schema documentation in `docs/schema/electricity-records.md`.
- Added Oracle SQL draft for electricity records in `docs/schema/electricity-records.oracle.sql`.
- Added vehicle schema documentation in `docs/schema/vehicle-records.md`.
- Added Oracle SQL draft for vehicle records in `docs/schema/vehicle-records.oracle.sql`.
- Updated `docs/project-overview.md` to reflect the current backend, frontend, routes, modules, and schema scope.
- Added this implementation log in `docs/implementation-log.md`.

### Backend: Electricity Records

- Added the `ElectricityModule`.
- Added TypeORM entity mapping for `ELECTRICITY_RECORDS`.
- Added create and update DTO validation for electricity records.
- Added CRUD endpoints under `/electricity-records`.
- Added electricity report endpoint under `/electricity-records/report`.
- Added electricity Excel export endpoint under `/electricity-records/export`.

### Frontend: Electricity Records

- Added electricity records API helpers and TypeScript types.
- Added the electricity records management page at `/electricity-records`.
- Added the electricity report page at `/electricity-records/report`.
- Added report filters, report table, dashboard components, and export integration.

### Backend: Vehicles

- Added the `VehiclesModule`.
- Added TypeORM entity mapping for `VEHICLES`.
- Added create and update DTO validation for vehicles.
- Added vehicle CRUD endpoints under `/vehicles`.
- Implemented soft delete by marking vehicles inactive.

### Frontend: Vehicles

- Added vehicle API helpers and TypeScript types.
- Added the vehicle management page at `/vehicles`.
- Added Vietnamese labels for the vehicle management UI.

### Backend: Vehicle Kilometer Records

- Added TypeORM entity mapping for `VEHICLE_KM_RECORDS`.
- Added create, update, and query DTO validation for kilometer records.
- Added kilometer record CRUD endpoints under `/vehicles/km-records`.
- Added optional filtering by `vehicleId` for kilometer records.
- Added validation so arrival odometer cannot be lower than departure odometer.
- Stored odometer readings as integer values.

### Frontend: Vehicle Kilometer Records

- Added the vehicle kilometer records page at `/vehicles/km-records`.
- Added kilometer record form and table components.
- Added Vietnamese labels for security staff.
- Added default driver suggestions for common drivers.
- Kept manual driver entry available through the same input field.
- Added a quick action to reuse the latest arrival odometer as the next departure odometer.

### Backend: Fuel Records

- Added TypeORM entity mapping for `FUEL_RECORDS`.
- Added create and update DTO validation for fuel records.
- Added fuel record CRUD endpoints under `/vehicles/fuel-records`.
- Kept `total_amount` out of the table because it can be calculated as `unit_price * liters`.

### Frontend: Fuel Records

- Added fuel record API helpers and TypeScript types.
- Added the fuel records page at `/vehicles/fuel-records`.
- Added fuel record form and table components.
- Added Vietnamese labels for general affairs users.
- Added UI calculation for total fuel amount from unit price and liters.

### Backend: General Affairs Dashboard

- Created a new `DashboardModule` to serve aggregated utility data.
- Implemented `DashboardService` to calculate summary metrics for both electricity (kWh, cost) and vehicles (KM, liters, fuel cost, cost/KM, KM/liter).
- Added 12-month trend calculations for unified charts.
- Added API endpoints with year and optional month validation parameters.

### Restructuring: Move Reports Into Management Pages (2026-05-23)

- Removed the standalone `Electricity Report` link from `Navbar` (keeping the route valid).
- Extended `GET /vehicles/fuel-records` and `GET /vehicles/km-records` APIs to accept `year`, `month`, and `vehicleId` filters.
- Added a `summary` object in the paginated response containing total metrics (total records, total liters/km, total cost, average unit price) calculated from all matching records.
- Added in-page filter fields (year, month, vehicle) and summary indicator panels inside `FuelRecordsPage` and `VehicleKmRecordsPage` in frontend.

## Current Open Items

- Add focused backend tests after the CRUD behavior is stable.
- Review whether production should keep TypeORM `synchronize: true` or move to controlled migrations.
