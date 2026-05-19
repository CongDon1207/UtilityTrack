import { Navigate, Route, Routes } from 'react-router-dom';
import {
  ElectricityRecordsPage,
  ElectricityReportPage,
} from './features/electricity';

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
    </Routes>
  );
}

export default App;
