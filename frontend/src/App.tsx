import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ElectricityRecordsPage,
  ElectricityReportPage,
} from './features/electricity';
import { VehicleKmRecordsPage, VehiclesPage } from './features/vehicles';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/electricity-records" replace />} />
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
    </Routes>
  );
}

export default App;
