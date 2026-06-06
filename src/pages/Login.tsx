import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Park as EcoIcon,
  Lock as LockIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Email dan password harus diisi.');
      return;
    }

    if (!email.includes('@')) {
      setError('Format email tidak valid.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[LoginPage] Calling login...');
      const result = await login(email, password);
      console.log('[LoginPage] Login result:', result);

      if (result.success) {
        console.log('[LoginPage] Login successful, navigating to /');
        // Navigate to dashboard after successful login
        navigate('/');
      } else {
        console.log('[LoginPage] Login failed:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      const errObj = err as { message?: string };
      setError(errObj.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F8FAF8 0%, #E8F5E9 100%)',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: alpha('#2E7D32', 0.04),
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: alpha('#4CAF50', 0.03),
          filter: 'blur(80px)',
        }}
      />

      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(46, 125, 50, 0.12)',
          border: '1px solid rgba(46, 125, 50, 0.08)',
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
                boxShadow: '0 12px 32px rgba(46, 125, 50, 0.3)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <EcoIcon sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1A1A2E',
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              TPS3R
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#6B7280', fontWeight: 500 }}
            >
              Admin Dashboard - Masuk untuk melanjutkan
            </Typography>
          </Box>

          {/* Form Section */}
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '12px',
                  fontSize: '0.8125rem',
                  alignItems: 'center',
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              disabled={isSubmitting}
              autoComplete="email"
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  backgroundColor: '#F8FAF8',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E8ECEF',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              disabled={isSubmitting}
              autoComplete="current-password"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  backgroundColor: '#F8FAF8',
                  '&:hover': {
                    backgroundColor: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50',
                    },
                  },
                  '&.Mui-focused': {
                    backgroundColor: '#FFFFFF',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#E8ECEF',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#2E7D32',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isSubmitting}
                        sx={{
                          color: '#9CA3AF',
                          '&:hover': {
                            color: '#2E7D32',
                            backgroundColor: alpha('#2E7D32', 0.08),
                          },
                          borderRadius: '8px',
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <VisibilityIcon sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.75,
                fontSize: '0.9375rem',
                fontWeight: 600,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                boxShadow: '0 8px 20px rgba(46, 125, 50, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                  boxShadow: '0 12px 28px rgba(46, 125, 50, 0.45)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: '#E8ECEF',
                  color: '#9CA3AF',
                },
                transition: 'all 0.25s ease',
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#fff' }} />
                  <span>Memproses...</span>
                </Box>
              ) : (
                'Masuk ke Dashboard'
              )}
            </Button>
          </Box>

          {/* Footer Info */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid #F0F2F5',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 1 }}>
              Akun Administrator
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                backgroundColor: '#F8FAF8',
                borderRadius: '10px',
                border: '1px solid #E8ECEF',
              }}
            >
              <Typography
                sx={{
                  color: '#5A6978',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              >
                admin@tps3r.com
              </Typography>
              <Typography sx={{ color: '#D1D5DB', fontWeight: 300 }}>/</Typography>
              <Typography
                sx={{
                  color: '#5A6978',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              >
                Admin123
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
          TPS3R Admin Dashboard v1.0.0 • Reduce • Reuse • Recycle
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;