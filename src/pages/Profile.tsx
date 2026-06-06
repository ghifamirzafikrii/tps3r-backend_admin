import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarIcon,
  Edit as EditIcon,
  CameraAlt as CameraIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useProfile, type AdminProfile } from '../contexts/ProfileContext';
import { AUTH_EVENTS } from '../services/api';
import PageHeader from '../components/PageHeader';

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format date for display
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const Profile = () => {
  const navigate = useNavigate();
  const { profile, isLoading, error, refreshProfile, updateProfile, uploadAvatar } = useProfile();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for editing
  const [formData, setFormData] = useState<Partial<AdminProfile>>({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  // Fetch profile on mount
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login', { replace: true });
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
    return () => window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, handleUnauthorized);
  }, [navigate]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
      });
    }
  }, [profile]);

  const handleEditClick = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
      });
      setEditDialogOpen(true);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setEditDialogOpen(false);
      // No need to call refreshProfile - API response already updated state
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview immediately for instant feedback
      const preview = URL.createObjectURL(file);
      setUploadPreview(preview);

      try {
        await uploadAvatar(file);
        // No need to call refreshProfile - API response already updated state
        setUploadPreview(null);
      } catch (err) {
        console.error('Failed to upload avatar:', err);
        setUploadPreview(null);
      }
    }
  };

  if (isLoading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#2E7D32' }} />
      </Box>
    );
  }

  if (error && !profile) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button onClick={() => refreshProfile()} sx={{ mt: 2 }}>Coba Lagi</Button>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box>
      <PageHeader
        title="Profil Saya"
        subtitle="Kelola informasi profil dan pengaturan akun Anda"
      />

      <Grid container spacing={3}>
        {/* Profile Card - Left Side */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}>
            {/* Profile Header with gradient */}
            <Box sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
              p: 4,
              textAlign: 'center',
              position: 'relative',
            }}>
              {/* Avatar Section */}
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                {uploadPreview || profile.avatar_url || profile.avatar ? (
                  <Avatar
                    src={uploadPreview || profile.avatar_url || profile.avatar}
                    alt={profile.name}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {getInitials(profile.name)}
                  </Avatar>
                )}

                {/* Camera Button */}
                <IconButton
                  onClick={handleAvatarClick}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#FFFFFF',
                    width: 40,
                    height: 40,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      bgcolor: '#F8FAF8',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <CameraIcon sx={{ fontSize: 20, color: '#2E7D32' }} />
                </IconButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>

              {/* Name and Role */}
              <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mt: 2 }}>
                {profile.name}
              </Typography>
              <Chip
                label={profile.role}
                size="small"
                sx={{
                  mt: 1.5,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Box>

            {/* Profile Stats */}
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="overline" sx={{ color: '#8898AA', display: 'block', mb: 1 }}>
                  Bergabung Sejak
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 20, color: '#2E7D32' }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                    {formatDate(profile.joinDate)}
                  </Typography>
                </Box>
              </Box>

              {profile.lastLogin && (
                <Box>
                  <Typography variant="overline" sx={{ color: '#8898AA', display: 'block', mb: 1 }}>
                    Login Terakhir
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: '#10B981' }} />
                    <Typography variant="body2" sx={{ color: '#5A6978' }}>
                      {profile.lastLogin}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details - Right Side */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}>
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A1A2E' }}>
                  Informasi Profil
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{
                    background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                    borderRadius: '12px',
                    px: 3,
                    py: 1.25,
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Edit Profil
                </Button>
              </Box>

              {/* Profile Fields */}
              <Grid container spacing={3}>
                {/* Name */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAF8',
                    border: '1px solid #E8ECEF',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2E7D32',
                      bgcolor: '#FFFFFF',
                    },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#2E7D32', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PersonIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500 }}>
                        Nama Lengkap
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A2E', ml: 5.5 }}>
                      {profile.name}
                    </Typography>
                  </Box>
                </Grid>

                {/* Email */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAF8',
                    border: '1px solid #E8ECEF',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2E7D32',
                      bgcolor: '#FFFFFF',
                    },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#6366F1', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <EmailIcon sx={{ fontSize: 18, color: '#6366F1' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500 }}>
                        Alamat Email
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A2E', ml: 5.5 }}>
                      {profile.email}
                    </Typography>
                  </Box>
                </Grid>

                {/* Phone */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAF8',
                    border: '1px solid #E8ECEF',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2E7D32',
                      bgcolor: '#FFFFFF',
                    },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#F59E0B', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <PhoneIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500 }}>
                        Nomor Telepon
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A2E', ml: 5.5 }}>
                      {profile.phone}
                    </Typography>
                  </Box>
                </Grid>

                {/* Role */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: '#F8FAF8',
                    border: '1px solid #E8ECEF',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#2E7D32',
                      bgcolor: '#FFFFFF',
                    },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        bgcolor: alpha('#EC4899', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BadgeIcon sx={{ fontSize: 18, color: '#EC4899' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500 }}>
                        Role / Jabatan
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1A1A2E', ml: 5.5 }}>
                      {profile.role}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Quick Actions */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1A1A2E', mb: 2 }}>
                  Aksi Cepat
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    sx={{
                      borderColor: '#E8ECEF',
                      color: '#5A6978',
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#2E7D32',
                        color: '#2E7D32',
                        bgcolor: alpha('#2E7D32', 0.04),
                      },
                    }}
                  >
                    Edit Informasi
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CameraIcon />}
                    onClick={handleAvatarClick}
                    sx={{
                      borderColor: '#E8ECEF',
                      color: '#5A6978',
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#2E7D32',
                        color: '#2E7D32',
                        bgcolor: alpha('#2E7D32', 0.04),
                      },
                    }}
                  >
                    Ganti Foto
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Edit Profil
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 2 }}>
            <TextField
              fullWidth
              label="Nama Lengkap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: '#8898AA' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Alamat Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#8898AA' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Nomor Telepon"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#8898AA' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#8898AA' }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              },
            }}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;