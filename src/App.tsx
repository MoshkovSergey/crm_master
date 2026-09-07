import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useAuthStore } from './store';
import AdminLayout from './components/Layout/AdminLayout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Admin/Dashboard';
import IncidentsPage from './pages/Admin/Incidents';
import ObjectsPage from './pages/Admin/Objects';
import ContractsPage from './pages/Admin/Contracts';
import WarehousePage from './pages/Admin/Warehouse';
import DispatchPage from './pages/Admin/Dispatch';
import PPRPage from './pages/Admin/PPR';
import ReportsPage from './pages/Admin/Reports';
import SettingsPage from './pages/Admin/Settings';
import NotFoundPage from './pages/NotFound/NotFoundPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            } />
            <Route path="/" element={
              <PrivateRoute><AdminLayout /></PrivateRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="objects" element={<ObjectsPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="warehouse" element={<WarehousePage />} />
              <Route path="dispatch" element={<DispatchPage />} />
              <Route path="ppr" element={<PPRPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
