import { Navigate, Route, Routes } from 'react-router-dom';
import { ElectricityRecordsPage } from './features/electricity';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/electricity-records" replace />} />
      <Route
        path="/electricity-records"
        element={<ElectricityRecordsPage />}
      />
    </Routes>
  );
}

export default App;
