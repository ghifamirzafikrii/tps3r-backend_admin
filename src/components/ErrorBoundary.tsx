import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('=== ERROR BOUNDARY CAUGHT ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAF8',
            p: 3,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '24px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: '3rem' }}>⚠️</Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: '#1A1A2E', mb: 1, textAlign: 'center' }}
          >
            Oops! Terjadi Kesalahan
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: '#8898AA', mb: 3, textAlign: 'center', maxWidth: 500 }}
          >
            Aplikasi mengalami error yang tidak terduga.
          </Typography>

          {this.state.error && (
            <Box
              sx={{
                width: '100%',
                maxWidth: 600,
                p: 3,
                borderRadius: '12px',
                backgroundColor: alpha('#EF4444', 0.05),
                border: '1px solid rgba(239, 68, 68, 0.2)',
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: '#DC2626',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.message}
              </Typography>
            </Box>
          )}

          <Button
            onClick={this.handleReset}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              },
            }}
          >
            Coba Lagi
          </Button>

          <Typography
            variant="caption"
            sx={{ color: '#D1D5DB', mt: 4, textAlign: 'center' }}
          >
            Cek console browser untuk detail error
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;