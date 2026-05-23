import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import {
  ElectricityRecordsPage,
  ElectricityReportPage,
} from './features/electricity';
import {
  FuelRecordsPage,
  VehicleKmRecordsPage,
  VehiclesPage,
} from './features/vehicles';

function App() {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/electricity-records" element={<ElectricityRecordsPage />} />
      <Route path="/admin/electricity-records/report" element={<ElectricityReportPage />} />
      <Route path="/admin/vehicles" element={<VehiclesPage />} />
      <Route path="/admin/vehicles/km-records" element={<VehicleKmRecordsPage />} />
      <Route path="/admin/vehicles/fuel-records" element={<FuelRecordsPage />} />

      {/* Security Routes */}
      <Route
        path="/security/vehicles/km-records"
        element={<VehicleKmRecordsPage showNavbar={false} />}
      />

      {/* Old Paths Redirects */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/electricity-records" element={<Navigate to="/admin/electricity-records" replace />} />
      <Route path="/electricity-records/report" element={<Navigate to="/admin/electricity-records/report" replace />} />
      <Route path="/vehicles" element={<Navigate to="/admin/vehicles" replace />} />
      <Route path="/vehicles/km-records" element={<Navigate to="/admin/vehicles/km-records" replace />} />
      <Route path="/vehicles/fuel-records" element={<Navigate to="/admin/vehicles/fuel-records" replace />} />

      {/* Catch-all for unsupported security paths */}
      <Route path="/security/*" element={<Navigate to="/security/vehicles/km-records" replace />} />
    </Routes>
  );
}

export default App;
