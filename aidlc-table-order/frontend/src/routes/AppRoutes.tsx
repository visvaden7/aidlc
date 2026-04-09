import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import TableSetupPage from '@/pages/customer/TableSetupPage';
import MenuPage from '@/pages/customer/MenuPage';
import CartPage from '@/pages/customer/CartPage';
import OrderConfirmPage from '@/pages/customer/OrderConfirmPage';
import OrderHistoryPage from '@/pages/customer/OrderHistoryPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminOrderHistoryPage from '@/pages/admin/AdminOrderHistoryPage';
import MenuManagementPage from '@/pages/admin/MenuManagementPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<TableSetupPage />} />
      <Route
        path="/menu"
        element={
          <ProtectedRoute requiredRole="TABLE">
            <MenuPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute requiredRole="TABLE">
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-confirm"
        element={
          <ProtectedRoute requiredRole="TABLE">
            <OrderConfirmPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredRole="TABLE">
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/menu"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <MenuManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tables/:id/history"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminOrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
