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
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route
        path="/electricity-records"
        element={<ElectricityRecordsPage />}
      />
      <Route
        path="/electricity-records/report"
        element={<ElectricityReportPage />}
      />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/vehicles/km-records" element={<VehicleKmRecordsPage />} />
      <Route path="/vehicles/fuel-records" element={<FuelRecordsPage />} />
    </Routes>
  );
}

export default App;
