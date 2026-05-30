# Changelog

All notable changes to this project will be documented in this file.

## [2026-05-23]
- **Add**: Dashboard Module for General Affairs at `backend/src/dashboard` - Integrates electricity and vehicle utility data for unified statistics (completed).
- **Change**: Restructure reports by adding in-page filters and summary metrics to fuel and KM records management pages, and clean up Navbar at backend & frontend - Improves GA utility report UX (completed).
- **Add**: Idempotent mock seed script at `backend/src/database/seed-mock.ts` - Seeds 2024 electricity records, vehicles, fuel records, and KM records from static JSON mock data files (completed).

## [2026-05-27]
- **Fix**: Vehicle deletion at `backend/src/vehicles/vehicles.service.ts` - Deletes vehicles without related KM or fuel records and blocks deletion when history exists (completed).

## [2026-05-30]
- **Change**: Disable automatic TypeORM schema synchronization by default at `backend/src/app.module.ts` - Prevents unintended database schema changes unless `TYPEORM_SYNCHRONIZE=true` is explicitly set (completed).
- **Remove**: Obsolete backend E2E scaffold at `backend/test` - Removes unsafe AppModule-based E2E test script and files (completed).
- **Change**: Allow open vehicle KM records without arrival odometer at `backend/src/vehicles` and `frontend/src/features/vehicles` - Supports recording vehicle departure first and completing arrival data later (completed).
- **Add**: Vehicle KM and fuel Excel exports at `backend/src/vehicles` and `frontend/src/features/vehicles` - Downloads filtered, formatted Excel reports from the KM and fuel pages (completed).
- **Fix**: Month-only vehicle record filters at `backend/src/vehicles` - Allows KM and fuel pages and exports to filter by month across all years and by month plus vehicle (completed).
