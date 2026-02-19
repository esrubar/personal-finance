import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();

  console.log('public', isAuthenticated);

  if (isAuthenticated === null) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/overview" replace /> : <Outlet />;
};
