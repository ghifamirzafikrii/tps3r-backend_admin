import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Tooltip,
  Divider,
  ListItemIcon,
  MenuItem,
  Menu,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  PersonOutlined as PersonIcon,
  SettingsOutlined as SettingsIcon,
  LogoutOutlined as LogoutIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  ChevronRightOutlined as ChevronRightIcon,
  KeyboardArrowDownOutlined as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { AUTH_EVENTS } from '../services/api';

interface NavbarProps {
  title: string;
  onMobileMenuOpen: () => void;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Navbar = ({ title, onMobileMenuOpen }: NavbarProps) => {
  const { logout } = useAuth();
  const { profile, darkMode, toggleDarkMode, refreshProfile } = useProfile();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      // Force redirect to login
      navigate('/login', { replace: true });
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
  }, [navigate]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    // Small delay for animation
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 300);
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  const notifications = [
    { id: 1, message: '5 setoran baru menunggu verifikasi', time: '5 menit lalu', unread: true },
    { id: 2, message: 'Member baru terdaftar hari ini', time: '1 jam lalu', unread: true },
    { id: 3, message: 'Transaksi #1234 berhasil diproses', time: '2 jam lalu', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: '#FFFFFF',
        color: 'text.primary',
        borderBottom: '1px solid #E8ECEF',
        boxShadow: 'none',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Mobile Menu Button */}
        <IconButton
          edge="start"
          onClick={onMobileMenuOpen}
          sx={{
            mr: 2,
            width: 40,
            height: 40,
            borderRadius: '10px',
            border: '1px solid #E8ECEF',
            '&:hover': { bgcolor: '#F8FAF8' },
          }}
        >
          <MenuIcon sx={{ fontSize: 20, color: '#5A6978' }} />
        </IconButton>

        {/* Page Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            color: '#1A1A2E',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            color: '#1A1A2E',
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Search Field - Desktop */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '12px',
            bgcolor: '#F8FAF8',
            border: '1px solid #E8ECEF',
            mr: 2,
            '&:hover': {
              borderColor: '#4CAF50',
              bgcolor: '#FFFFFF',
            },
            '&:focus-within': {
              borderColor: '#2E7D32',
              boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.08)',
              bgcolor: '#FFFFFF',
            },
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            width: 280,
            transition: 'all 0.2s ease',
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: '#9CA3AF', ml: 1.5 }} />
          <InputBase
            placeholder="Cari..."
            sx={{
              flex: 1,
              py: 1,
              px: 1.5,
              fontSize: '0.8125rem',
              '& input': {
                p: 0,
                '&::placeholder': { color: '#9CA3AF', opacity: 1 },
              },
            }}
          />
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderLeft: '1px solid #E8ECEF',
              borderRadius: '0 10px 10px 0',
              bgcolor: '#FFFFFF',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: '#9CA3AF',
              display: { xs: 'none', lg: 'block' },
            }}
          >
            Ctrl+K
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {/* Quick Search Mobile */}
          <IconButton
            size="large"
            sx={{
              display: { xs: 'flex', sm: 'none' },
              width: 40,
              height: 40,
              borderRadius: '10px',
            }}
          >
            <SearchIcon sx={{ fontSize: 20, color: '#5A6978' }} />
          </IconButton>

          {/* Notifications */}
          <Tooltip title="Notifikasi">
            <IconButton
              onClick={handleNotificationMenuOpen}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                border: '1px solid #E8ECEF',
                '&:hover': { bgcolor: '#F8FAF8' },
              }}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.625rem',
                    height: 16,
                    minWidth: 16,
                  },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 20, color: '#5A6978' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Avatar with Dropdown */}
          <Tooltip title="Profil & Akun">
            <Box
              onClick={handleProfileMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 1,
                pl: 1,
                pr: 1.5,
                py: 0.5,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid transparent',
                '&:hover': {
                  bgcolor: '#F8FAF8',
                  borderColor: '#E8ECEF',
                },
              }}
            >
              <Avatar
                src={profile?.avatar_url || profile?.avatar || undefined}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#2E7D32',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}
              >
                {profile ? getInitials(profile.name) : 'A'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: '#1A1A2E', lineHeight: 1.2, display: 'block' }}
                >
                  {profile?.name || 'Admin TPS3R'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8898AA', fontSize: '0.6875rem' }}>
                  {profile?.role || 'Super Admin'}
                </Typography>
              </Box>
              <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#8898AA' }} />
            </Box>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Profile Dropdown Menu - Professional Enterprise Style */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 280,
              maxWidth: 320,
              borderRadius: '16px',
              border: '1px solid #E8ECEF',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              overflow: 'visible',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 24,
                width: 12,
                height: 12,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                borderTop: '1px solid #E8ECEF',
                borderLeft: '1px solid #E8ECEF',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Profile Header Card */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
            borderRadius: '12px 12px 0 0',
            p: 2.5,
            mx: 1,
            mt: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <Box sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            <Avatar
              src={profile?.avatar_url || profile?.avatar || undefined}
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontSize: '1.25rem',
                fontWeight: 700,
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {profile ? getInitials(profile.name) : 'A'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                {profile?.name || 'Admin TPS3R'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {profile?.email || 'admin@tps3r.com'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <Box sx={{ py: 1 }}>
          {/* Profil Saya */}
          <MenuItem
            onClick={() => handleNavigate('/profile')}
            sx={{
              mx: 1,
              my: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha('#2E7D32', 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha('#6366F1', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PersonIcon sx={{ fontSize: 18, color: '#6366F1' }} />
              </Box>
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                Profil Saya
              </Typography>
              <Typography variant="caption" sx={{ color: '#8898AA' }}>
                Lihat & edit informasi akun
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ fontSize: 18, color: '#D1D5DB' }} />
          </MenuItem>

          {/* Pengaturan */}
          <MenuItem
            onClick={() => handleNavigate('/settings')}
            sx={{
              mx: 1,
              my: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha('#2E7D32', 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha('#F59E0B', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <SettingsIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
              </Box>
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                Pengaturan
              </Typography>
              <Typography variant="caption" sx={{ color: '#8898AA' }}>
                Preferensi & konfigurasi
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ fontSize: 18, color: '#D1D5DB' }} />
          </MenuItem>

          {/* Notifikasi */}
          <MenuItem
            onClick={handleNotificationMenuOpen}
            sx={{
              mx: 1,
              my: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha('#2E7D32', 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha('#10B981', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Badge
                  badgeContent={unreadCount}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.625rem',
                      height: 16,
                      minWidth: 16,
                    },
                  }}
                >
                  <NotificationsIcon sx={{ fontSize: 18, color: '#10B981' }} />
                </Badge>
              </Box>
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                Notifikasi
              </Typography>
              <Typography variant="caption" sx={{ color: '#8898AA' }}>
                {unreadCount} notifikasi baru
              </Typography>
            </Box>
            <ChevronRightIcon sx={{ fontSize: 18, color: '#D1D5DB' }} />
          </MenuItem>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Dark Mode Toggle */}
        <Box sx={{ px: 2, py: 1 }}>
          <MenuItem
            onClick={toggleDarkMode}
            sx={{
              mx: 0,
              my: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha('#2E7D32', 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(darkMode ? '#6366F1' : '#F59E0B', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: 18, color: '#6366F1' }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                )}
              </Box>
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                Mode {darkMode ? 'Terang' : 'Gelap'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8898AA' }}>
                Aktifkan tema {darkMode ? 'terang' : 'gelap'}
              </Typography>
            </Box>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#2E7D32',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: '#2E7D32',
                },
              }}
            />
          </MenuItem>
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Logout */}
        <Box sx={{ px: 2, pb: 2 }}>
          <MenuItem
            onClick={handleLogoutClick}
            sx={{
              mx: 0,
              my: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              color: '#EF4444',
              '&:hover': {
                bgcolor: alpha('#EF4444', 0.08),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha('#EF4444', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <LogoutIcon sx={{ fontSize: 18, color: '#EF4444' }} />
              </Box>
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Keluar
            </Typography>
          </MenuItem>
        </Box>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              width: 360,
              maxHeight: 420,
              borderRadius: '16px',
              border: '1px solid #E8ECEF',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: '1px solid #F0F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
            Notifikasi
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#2E7D32',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Tandai semua dibaca
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleMenuClose}
            sx={{
              py: 2,
              px: 2.5,
              borderBottom: '1px solid #F0F2F5',
              '&:last-child': { borderBottom: 'none' },
              '&:hover': { bgcolor: '#F8FAF8' },
              bgcolor: notification.unread ? alpha('#2E7D32', 0.03) : 'transparent',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: notification.unread ? '#2E7D32' : '#D1D5DB',
                  mt: 0.75,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: notification.unread ? 600 : 400, color: '#1A1A2E', mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" sx={{ color: '#8898AA' }}>
                  {notification.time}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
        <Divider sx={{ borderColor: '#F0F2F5' }} />
        <MenuItem
          onClick={handleMenuClose}
          sx={{ justifyContent: 'center', py: 1.5, color: '#2E7D32' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Lihat Semua Notifikasi
          </Typography>
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: 400,
            },
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: alpha('#EF4444', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <LogoutIcon sx={{ fontSize: 32, color: '#EF4444' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1A1A2E' }}>
            Konfirmasi Keluar
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <DialogContentText sx={{ color: '#5A6978' }}>
            Apakah Anda yakin ingin keluar dari akun ini? Anda perlu login kembali untuk mengakses dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#E8ECEF',
              color: '#5A6978',
              borderRadius: '12px',
              py: 1.25,
              '&:hover': {
                borderColor: '#D1D5DB',
                bgcolor: '#F8FAF8',
              },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            fullWidth
            disabled={isLoggingOut}
            sx={{
              background: '#EF4444',
              borderRadius: '12px',
              py: 1.25,
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: '#DC2626',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
              },
            }}
          >
            {isLoggingOut ? 'Keluar...' : 'Ya, Keluar'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;