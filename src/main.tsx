import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './styles/theme';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';

// Console logging for debugging
console.log('[main.tsx] Application starting...');

// Global error handler for uncaught errors
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[GLOBAL ERROR]', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event) => {
  console.error('[UNHANDLED PROMISE REJECTION]', event.reason);
};

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

console.log('[main.tsx] React app mounted successfully');