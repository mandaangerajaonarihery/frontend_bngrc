import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { RubriqueDetails } from './pages/RubriqueDetails';
import { TypeRubriqueDetails } from './pages/TypeRubriqueDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLayout } from './pages/admin/AdminLayout';
import { RubriqueManager } from './pages/admin/RubriqueManager';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RubriqueDetailManager } from './pages/admin/RubriqueDetailManager';
import { Toaster } from './components/Toaster';
import { UserRole } from './types/authTypes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Client Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="rubriques" element={<Navigate to="/" replace />} />
            <Route path="rubriques/:id" element={<RubriqueDetails />} />
            <Route path="rubriques/:rubriqueId/types/:typeId" element={<TypeRubriqueDetails />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole={UserRole.ADMIN}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="rubriques" element={<RubriqueManager />} />
            <Route path="rubriques/:id" element={<RubriqueDetailManager />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
