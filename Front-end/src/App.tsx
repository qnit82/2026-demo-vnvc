import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import './i18n';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { Suspense } from 'react';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import RegistrationPage from './pages/RegistrationPage';
import ScreeningPage from './pages/ScreeningPage';
import InjectionPage from './pages/InjectionPage';
import PaymentPage from './pages/PaymentPage';
import InventoryPage from './pages/InventoryPage';
import ReportPage from './pages/ReportPage';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return user ? <>{children}</> : <Navigate to="/login" />;
};


function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-bg flex items-center justify-center text-white text-2xl animate-pulse">Loading VNVC...</div>}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Main Layout for protected routes: để giữ nguyên layout khi chuyển trang */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<RegistrationPage />} />
            <Route path="screening" element={<ScreeningPage />} />
            <Route path="injection" element={<InjectionPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="reports" element={<ReportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
