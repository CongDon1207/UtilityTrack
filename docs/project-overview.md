# UtilityTrack Project Overview

## Purpose

UtilityTrack is an internal utility tracking system for operational records that are currently managed from spreadsheets. The project is being built in small modules so each department can enter the data it owns and the administrative team can review usage and cost.

The current implemented scope covers:

- Electricity usage and cost records.
- Vehicle master data.
- Vehicle kilometer trip records.
- Fuel purchase records.

## Source Workbooks

The current schema and screens are based on the sample files stored under:

```txt
docs/Sample_data/
```

Relevant source files include:

- Electricity usage workbook.
- `KM_xe.xlsx` for vehicle kilometer records.
- Fuel purchase workbook for fuel records.

## Repository Structure

```txt
UtilityTrack/
  README.md
  package.json
  backend/
    src/
      app.module.ts
      common/
        dto/
          pagination-query.dto.ts
      dashboard/
      electricity/
      vehicles/
  frontend/
    src/
      App.tsx
      shared/
        api/
          http.ts
      features/
        electricity/
        vehicles/
  docs/
    project-overview.md
    schema/
      electricity-records.md
      electricity-records.oracle.sql
      vehicle-records.md
      vehicle-records.oracle.sql
    Sample_data/
```

## Technology Stack

### Backend

- Runtime: Node.js
- Framework: NestJS
- Language: TypeScript
- Database: Oracle
- ORM: TypeORM
- Validation: `class-validator` and `class-transformer`
- Excel export support: `exceljs`

### Frontend

- Framework: React
- Language: TypeScript
- Build tool: Vite
- Routing: React Router
- Server state: TanStack Query
- Styling: Tailwind CSS
- Charts: Recharts

### Workspace Scripts

The root package provides combined backend and frontend scripts:

```txt
npm run dev
npm run public
npm run build
npm run lint
npm run test:backend
```

## Backend Architecture

The backend is organized by feature modules. The root `AppModule` loads configuration from environment variables, connects to Oracle through TypeORM, and registers the active feature modules.

Active modules:

- `ElectricityModule`
- `VehiclesModule`
- `DashboardModule`

The Oracle connection uses these environment variables:

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SERVICE_NAME`

## Electricity Module

The electricity module manages monthly electricity records and reporting.

### Backend Files

```txt
backend/src/electricity/
  dto/
    create-electricity-record.dto.ts
    electricity-report-query.dto.ts
    update-electricity-record.dto.ts
  electricity-record.entity.ts
  electricity.controller.ts
  electricity-export.service.ts
  electricity-report.service.ts
  electricity.module.ts
  electricity.service.ts
  types/
    electricity-report.ts
```

### API Endpoints

```txt
GET    /electricity-records
GET    /electricity-records/report
GET    /electricity-records/export
GET    /electricity-records/:id
POST   /electricity-records
PATCH  /electricity-records/:id
DELETE /electricity-records/:id
```

### Frontend Pages

```txt
/electricity-records
/electricity-records/report
```

The electricity records page supports CRUD workflows. The report page supports reporting views and export through the backend export endpoint.

## Vehicle Module

The vehicle module manages vehicle names, kilometer records entered by security staff, and fuel records entered by general affairs.

### Backend Files

```txt
backend/src/vehicles/
  dto/
    create-fuel-record.dto.ts
    create-vehicle.dto.ts
    create-vehicle-km-record.dto.ts
    update-fuel-record.dto.ts
    update-vehicle.dto.ts
    update-vehicle-km-record.dto.ts
    vehicle-km-records-query.dto.ts
  fuel-record.entity.ts
  vehicle.entity.ts
  vehicle-km-record.entity.ts
  vehicles.controller.ts
  vehicles.module.ts
  vehicles.service.ts
```

### API Endpoints

Vehicle master data:

```txt
GET    /vehicles
GET    /vehicles/:id
POST   /vehicles
PATCH  /vehicles/:id
DELETE /vehicles/:id
```

Vehicle kilometer records:

```txt
GET    /vehicles/km-records
GET    /vehicles/km-records/:id
POST   /vehicles/km-records
PATCH  /vehicles/km-records/:id
DELETE /vehicles/km-records/:id
```

Fuel records:

```txt
GET    /vehicles/fuel-records
GET    /vehicles/fuel-records/:id
POST   /vehicles/fuel-records
PATCH  /vehicles/fuel-records/:id
DELETE /vehicles/fuel-records/:id
```

### Frontend Pages

```txt
/vehicles
/vehicles/km-records
/vehicles/fuel-records
```

The current vehicle frontend supports:

- Managing vehicle names.
- Entering and editing kilometer trip records.
- Selecting a driver from default suggestions while still allowing manual driver entry.
- Reusing the latest arrival odometer as the next departure odometer.
- Entering and editing fuel purchase records.
- Calculating fuel total amount in the UI from unit price and liters.

## Database Schema

The documented tables are:

- `ELECTRICITY_RECORDS`
- `VEHICLES`
- `VEHICLE_KM_RECORDS`
- `FUEL_RECORDS`

Detailed schema notes and Oracle SQL drafts are stored in:

```txt
docs/schema/
```

Important design decisions:

- Vehicle names are stored in `VEHICLES`.
- `VEHICLE_KM_RECORDS` and `FUEL_RECORDS` are separate because they are entered by different teams.
- `distance_km` is not stored because it can be calculated from odometer readings.
- `total_amount` is not stored because it can be calculated from unit price and liters.
- Report-level metrics should be calculated by queries, services, or frontend views instead of duplicated in source tables.

## Current Navigation State

The root frontend route redirects to:

```txt
/electricity-records
```

The vehicle pages are available by direct routes. A shared navigation menu has not been added yet.

## Verification Status

The recent backend and frontend changes were checked with targeted build and lint commands. The frontend build may require permission to write TypeScript cache files under `frontend/node_modules/.tmp` on this Windows machine.

Known checks used during implementation:

```txt
npm.cmd run build --prefix backend
npm.cmd run lint --prefix backend
npm.cmd run build --prefix frontend
npm.cmd run lint --prefix frontend
```
