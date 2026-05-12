import { Navigate, Outlet } from 'react-router-dom';
import { useGetLoggedUser } from '@/utilities/authorization';

const ProtectedRoute = ({ allowAdminOnly }) => {
  const user = useGetLoggedUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowAdminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!allowAdminOnly && user.isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
