import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { RubriqueDetails } from './pages/RubriqueDetails';
import { TypeRubriqueDetails } from './pages/TypeRubriqueDetails';
import { AdminLayout } from './pages/admin/AdminLayout';
import { RubriqueManager } from './pages/admin/RubriqueManager';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RubriqueDetailManager } from './pages/admin/RubriqueDetailManager';
import { Toaster } from './components/Toaster';

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="rubriques" element={<Navigate to="/" replace />} />
          <Route path="rubriques/:id" element={<RubriqueDetails />} />
          <Route path="rubriques/:rubriqueId/types/:typeId" element={<TypeRubriqueDetails />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="rubriques" element={<RubriqueManager />} />
          <Route path="rubriques/:id" element={<RubriqueDetailManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
