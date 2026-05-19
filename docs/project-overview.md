# UtilityTrack Project Overview

## Purpose

UtilityTrack is a utility management system for tracking operational utility usage and cost. The current implementation starts with electricity records first.

The electricity module stores monthly electricity usage and cost by fixed location option and department group.

## Current Repository Structure

```txt
UtilityTrack/
  README.md
  docs/
    project-overview.md
    schema/
      electricity-records.md
      electricity-records.oracle.sql
    Sample_data/
      BẢNG CHI TIẾT SỬ DỤNG ĐIỆN CỦA CÁC BỘ PHẬN 2024.xlsx
      KM_xe.xlsx
      ĐỔ DẦU.xlsx
  backend/
    src/
      app.module.ts
      app.service.ts
      main.ts
      common/
        dto/
          pagination-query.dto.ts
      electricity/
        dto/
          create-electricity-record.dto.ts
          update-electricity-record.dto.ts
        electricity-record.entity.ts
        electricity.controller.ts
        electricity.module.ts
        electricity.service.ts
  frontend/
    src/
      App.tsx
      main.tsx
```

## Current Backend Stack

- Runtime: Node.js
- Framework: NestJS
- Language: TypeScript
- Package manager: pnpm
- Validation: class-validator and class-transformer
- Database: Oracle
- ORM: TypeORM

## Current Backend Behavior

The backend currently contains one domain feature module: `electricity`.

The `ElectricityModule` is imported into the root `AppModule`, so the routes declared in `ElectricityController` are active.

## Current Electricity Module

### Files

```txt
backend/src/electricity/
  dto/
    create-electricity-record.dto.ts
    update-electricity-record.dto.ts
  electricity-record.entity.ts
  electricity.controller.ts
  electricity.module.ts
  electricity.service.ts
```

### Responsibilities

`electricity-record.entity.ts`

Maps the Oracle `ELECTRICITY_RECORDS` table to TypeORM.

`create-electricity-record.dto.ts`

Defines and validates the request body for creating an electricity record.

`update-electricity-record.dto.ts`

Defines the optional request body for updating an electricity record.

`electricity.service.ts`

Contains electricity record business logic and database operations.

`electricity.controller.ts`

Defines HTTP endpoints under:

```txt
/electricity-records
```

`electricity.module.ts`

Registers the electricity entity, controller, and service.

## Current API Endpoints

### Get electricity records

```txt
GET /electricity-records
GET /electricity-records?page=1&limit=10
```

Returns paginated electricity records.

### Get one electricity record by id

```txt
GET /electricity-records/:id
```

Returns a single electricity record when found.

If the id does not exist, the service throws a NestJS `NotFoundException`, which produces a `404 Not Found` response.

### Create an electricity record

```txt
POST /electricity-records
```

Expected JSON body:

```json
{
  "recordYear": 2025,
  "recordMonth": 1,
  "location": "MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO",
  "departmentGroup": "MAY",
  "kwhUsed": 22109,
  "totalCost": 54350205,
  "note": "Imported from electricity workbook"
}
```

Supported `location` values:

```txt
MAY_MAY_DIEN_TU_VAN_PHONG_NHA_BEP_KHO
CAT_CHUAN_BI_UV_TECH_CU
LASTING
PHONG_TECH_MOI
```

### Update an electricity record

```txt
PATCH /electricity-records/:id
```

### Delete an electricity record

```txt
DELETE /electricity-records/:id
```

The current implementation deletes electricity records directly because the schema does not include a soft-delete column.

## Current Frontend Behavior

The frontend is being reset around electricity records. The root route redirects to:

```txt
/electricity-records
```

The current page is a placeholder for the future electricity records management screen.

## Schema Notes

The current electricity schema is documented in:

```txt
docs/schema/electricity-records.md
```

The table intentionally does not store derived values such as previous-month difference. Those values should be calculated in reporting queries or API responses.

## Recommended Next Steps

1. Build the frontend electricity records page.
2. Add frontend API helpers and types for electricity records.
3. Add create, list, update, and delete UI flows.
4. Add focused API tests after the CRUD surface stabilizes.
