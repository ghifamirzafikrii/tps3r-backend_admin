import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('[ProtectedRoute] Render:', { isAuthenticated, isLoading });

  // Show nothing while checking authentication (loading)
  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading spinner');
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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('[ProtectedRoute] Authenticated, rendering children');
  // If authenticated, render the child routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;