import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children?: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking authentication (loading)
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#F8FAF8',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: '4px solid #E8F5E9',
            borderTopColor: '#2E7D32',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
        <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
          Memuat...
        </span>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, Render the public page (login)
  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;