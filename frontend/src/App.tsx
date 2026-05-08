import { LocationsPage } from './features/locations/LocationsPage'
import { Navigate, Route, Routes} from 'react-router-dom'


function App() {

  return (
    <Routes>
      <Route path = "/" element={<Navigate to="/locations" replace />}/>
      <Route path = "/locations" element={<LocationsPage/>}/>
    </Routes>
  )
}

export default App
