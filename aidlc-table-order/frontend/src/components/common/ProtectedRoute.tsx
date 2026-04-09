import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'TABLE' | 'ADMIN';
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated || role !== requiredRole) {
    const redirectTo = requiredRole === 'ADMIN' ? '/admin/login' : '/';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
