import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

const PageHeader = ({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 16, color: '#D1D5DB' }} />}
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              underline={crumb.href ? 'hover' : 'none'}
              color={crumb.href ? 'primary' : 'text.disabled'}
              href={crumb.href || '#'}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                '&:hover': { color: '#2E7D32' },
              }}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Title and Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1A1A2E',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: '#8898AA', mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>{actions}</Box>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;