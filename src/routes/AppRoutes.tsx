import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Components
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

// Layout
import AdminLayout from '../layouts/AdminLayout';

// Lazy page components
const LazyDashboard = lazy(() => import('../pages/Dashboard'));
const LazyMembers = lazy(() => import('../pages/Members'));
const LazyTransactions = lazy(() => import('../pages/Transactions'));
const LazyVerification = lazy(() => import('../pages/Verification'));
const LazyEducation = lazy(() => import('../pages/Education'));
const LazyReports = lazy(() => import('../pages/Reports'));
const LazySettings = lazy(() => import('../pages/Settings'));
const LazyProfile = lazy(() => import('../pages/Profile'));
const LazyLogin = lazy(() => import('../pages/Login'));

// Debug logging helper
const log = (stage: string, message: string) => {
  console.log(`[AppRoutes] [${stage}] ${message}`);
};

// Page loading fallback with premium styling
const PageLoader = () => (
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

// 404 Page component
const NotFoundPage = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#F8FAF8',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: '#FEF2F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#EF4444',
      }}
    >
      404
    </div>
    <h2 style={{ color: '#1A1A2E', margin: 0 }}>Halaman Tidak Ditemukan</h2>
    <p style={{ color: '#6B7280', margin: 0 }}>Maaf, halaman yang Anda cari tidak ada.</p>
    <a
      href="/"
      style={{
        marginTop: '8px',
        padding: '12px 24px',
        backgroundColor: '#2E7D32',
        color: '#fff',
        borderRadius: '10px',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      Kembali ke Dashboard
    </a>
  </div>
);

// App Routes Component using Routes component API (compatible with v7)
const AppRoutes = () => {
  log('MOUNT', 'AppRoutes component mounted');

  return (
    <Routes>
      {/* Login Route - Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<PageLoader />}>
              <LazyLogin />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Index route - Dashboard */}
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyDashboard />
            </Suspense>
          }
        />

        {/* Other protected routes */}
        <Route
          path="members"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyMembers />
            </Suspense>
          }
        />
        <Route
          path="transactions"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyTransactions />
            </Suspense>
          }
        />
        <Route
          path="verification"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyVerification />
            </Suspense>
          }
        />
        <Route
          path="education"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyEducation />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyReports />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazySettings />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader />}>
              <LazyProfile />
            </Suspense>
          }
        />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

// Export route paths for reference
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/',
  MEMBERS: '/members',
  TRANSACTIONS: '/transactions',
  VERIFICATION: '/verification',
  EDUCATION: '/education',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;