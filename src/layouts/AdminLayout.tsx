import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';
import Navbar from '../components/Navbar';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/members': 'Kelola Member',
  '/transactions': 'Transaksi Setoran',
  '/verification': 'Verifikasi Setoran',
  '/education': 'Edukasi',
  '/reports': 'Laporan',
  '/settings': 'Pengaturan',
};

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return pageTitles['/'];
    for (const [key, value] of Object.entries(pageTitles)) {
      if (key !== '/' && path.startsWith(key)) {
        return value;
      }
    }
    return 'Dashboard';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8FAF8',
        overflowX: 'hidden',
      }}
    >
      {/* Sidebar - Fixed for desktop, Drawer for mobile */}
      {!isMobile && (
        <Box
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            overflowY: 'auto',
            zIndex: 1200,
          }}
        >
          <Sidebar mobileOpen={false} onMobileClose={() => {}} />
        </Box>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Sidebar mobileOpen={mobileOpen} onMobileClose={handleMobileDrawerClose} />
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden',
          ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Navbar */}
        <Navbar title={getPageTitle()} onMobileMenuOpen={handleMobileDrawerToggle} />

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, sm: 3, md: 4 },
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              maxWidth: 1600,
              mx: 'auto',
              width: '100%',
              animation: 'fadeIn 0.3s ease',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(8px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;