# UtilityTrack Project Overview

## Purpose

UtilityTrack is planned as a utility management system for tracking electricity, water, fuel, and related operational costs. The long-term goal is to collect usage records, calculate costs, and provide dashboards that help users monitor trends, compare locations, and detect abnormal consumption.

The project is currently in the early backend setup stage. The frontend has not been created yet.

## Current Repository Structure

```txt
UtilityTrack/
  README.md
  docs/
    project-overview.md
  backend/
    src/
      app.module.ts
      app.service.ts
      main.ts
      locations/
        dto/
          create-location.dto.ts
        locations.controller.ts
        locations.module.ts
        locations.service.ts
    package.json
    pnpm-lock.yaml
    tsconfig.json
```

## Current Backend Stack

- Runtime: Node.js
- Framework: NestJS
- Language: TypeScript
- Package manager: pnpm
- Validation: class-validator and class-transformer
- Database: not added yet
- Authentication: not added yet

## Current Backend Behavior

The backend currently contains one feature module: `locations`.

Locations represent physical or business places where utility data will later be tracked. Examples include offices, factories, warehouses, homes, rental rooms, or other managed sites.

The `LocationsModule` is imported into the root `AppModule`, so the routes declared in `LocationsController` are active.

## Current Locations Module

### Files

```txt
backend/src/locations/
  dto/
    create-location.dto.ts
  locations.controller.ts
  locations.module.ts
  locations.service.ts
```

### Responsibilities

`locations.module.ts`

Registers the controller and service for the locations feature.

`locations.controller.ts`

Defines HTTP endpoints under:

```txt
/locations
```

`locations.service.ts`

Contains the current business logic and stores temporary in-memory location data.

`create-location.dto.ts`

Defines the expected request body shape for creating a location and includes validation decorators.

## Current API Endpoints

### Get all locations

```txt
GET /locations
```

Returns the current in-memory list of locations.

### Get one location by id

```txt
GET /locations/:id
```

Returns a single location when found.

If the id does not exist, the service throws a NestJS `NotFoundException`, which produces a `404 Not Found` response.

### Create a location

```txt
POST /locations
```

Expected JSON body:

```json
{
  "name": "Nha kho Quan 7",
  "code": "WAREHOUSE-Q7",
  "type": "warehouse",
  "address": "Quan 7, TP HCM"
}
```

Supported `type` values:

```txt
home
office
factory
warehouse
rental_room
other
```

The created location is currently stored only in memory. It will be lost when the backend process restarts.

## Current Validation Setup

Global validation is enabled in `backend/src/main.ts` with `ValidationPipe`.

Current behavior:

- Unknown fields are rejected.
- DTO decorators are used to validate request bodies.
- Invalid requests return `400 Bad Request`.

The current `CreateLocationDto` validates:

- `name`: required string
- `code`: optional string
- `type`: required string and must be one of the allowed location types
- `address`: optional string

## How To Run The Backend

From the backend directory:

```powershell
cd F:\workplace\UtilityTrack\backend
pnpm install
pnpm run dev
```

The development server runs in watch mode and usually listens on:

```txt
http://localhost:3000
```

Useful checks:

```txt
GET http://localhost:3000/locations
GET http://localhost:3000/locations/1
```

## Current Limitations

- Data is stored in memory only.
- No database integration yet.
- No authentication or authorization yet.
- No update or delete endpoints yet.
- No meter, reading, fuel, expense, bill, or dashboard modules yet.
- No Swagger documentation yet.
- No frontend application yet.

## Recommended Next Backend Steps

1. Add `PATCH /locations/:id` for updating location records.
2. Add `DELETE /locations/:id` or soft-delete support using `isActive`.
3. Add a shared type or entity file for the `Location` model instead of keeping the interface inside the service.
4. Add Prisma and PostgreSQL for persistent storage.
5. Replace the in-memory locations array with database queries.
6. Add modules for meters and meter readings.
7. Add fuel records and expense modules.
8. Add dashboard/report endpoints after enough data exists.

## Planned Domain Model

The project will likely evolve around these main entities:

```txt
Location
Meter
MeterReading
FuelRecord
Expense
Bill
Alert
DashboardReport
```

Expected relationship direction:

```txt
Location -> Meter -> MeterReading
Location -> FuelRecord
Location -> Expense
Location -> Bill
```

`Location` is intentionally the first module because most later records will belong to a location.

## Development Notes

This project is currently being built step by step. The first goal is to understand and implement clean NestJS module structure before adding database complexity.

The current learning path is:

```txt
Controller -> Service -> DTO -> Validation -> CRUD -> Database
```

