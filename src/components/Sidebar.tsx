import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Box,
  Typography,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  SwapHoriz as TransactionsIcon,
  CheckCircleOutlined as VerificationIcon,
  Article as EducationIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  Park as EcoIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { id: 'members', label: 'Kelola Member', icon: <PeopleIcon />, path: '/members' },
  { id: 'transactions', label: 'Transaksi', icon: <TransactionsIcon />, path: '/transactions' },
  { id: 'verification', label: 'Verifikasi', icon: <VerificationIcon />, path: '/verification', badge: '5' },
  { id: 'education', label: 'Edukasi', icon: <EducationIcon />, path: '/education' },
  { id: 'reports', label: 'Laporan', icon: <ReportsIcon />, path: '/reports' },
  { id: 'settings', label: 'Pengaturan', icon: <SettingsIcon />, path: '/settings' },
];

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E8ECEF',
      }}
    >
      {/* Logo Header */}
      <Box
        sx={{
          px: 3,
          py: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid #F0F2F5',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(46, 125, 50, 0.25)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <EcoIcon sx={{ fontSize: 24, color: '#fff' }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: '#1A1A2E',
              fontWeight: 700,
              fontSize: '1.125rem',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            TPS3R
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#8898AA', fontSize: '0.6875rem', fontWeight: 500 }}
          >
            Admin Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 2, px: 2, overflowY: 'auto' }}>
        <Typography
          variant="overline"
          sx={{
            color: '#AAB5C2',
            fontSize: '0.625rem',
            fontWeight: 600,
            px: 1.5,
            mb: 1,
            display: 'block',
            letterSpacing: '0.08em',
          }}
        >
          Menu Utama
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    onItemClick?.();
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    bgcolor: active ? alpha('#2E7D32', 0.08) : 'transparent',
                    color: active ? '#2E7D32' : '#5A6978',
                    mx: 0.5,
                    '&:hover': {
                      bgcolor: active ? alpha('#2E7D32', 0.12) : '#F5F7F5',
                    },
                    '&::before': active
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '50%',
                          borderRadius: '0 6px 6px 0',
                          bgcolor: '#2E7D32',
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: active ? '#2E7D32' : '#8898AA',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: active ? 600 : 500,
                      flex: 1,
                      color: active ? '#2E7D32' : '#5A6978',
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Box
                      sx={{
                        minWidth: 22,
                        height: 22,
                        borderRadius: '11px',
                        bgcolor: active ? '#2E7D32' : '#F0F2F5',
                        color: active ? '#fff' : '#8898AA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        px: 1,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 3, py: 3, borderTop: '1px solid #F0F2F5' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '14px',
            bgcolor: '#F8FAFC',
            border: '1px solid #E8ECEF',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#8898AA', fontSize: '0.6875rem', fontWeight: 500 }}>
            TPS3R Admin v1.0.0
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#AAB5C2', fontSize: '0.625rem', display: 'block', mt: 0.25 }}
          >
            Reduce • Reuse • Recycle
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const drawerContent = <SidebarContent onItemClick={onMobileClose} />;

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E8ECEF',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
export { DRAWER_WIDTH };