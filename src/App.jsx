import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import VerifyPage from './pages/VerifyPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/verify/:id" element={<VerifyPage />} />
    </Routes>
  );
}
