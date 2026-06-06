import { Box, Card, CardContent, Typography, alpha } from '@mui/material';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = '#2E7D32',
}: StatCardProps) => {
  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        border: '1px solid #E8ECEF',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          '& .stat-icon': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#8898AA',
                fontWeight: 500,
                fontSize: '0.75rem',
                mb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                color: '#1A1A2E',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: '#AAB5C2',
                  display: 'block',
                  mt: 0.5,
                  fontSize: '0.6875rem',
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Icon */}
          <Box
            className="stat-icon"
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              backgroundColor: alpha(color, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Trend */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: '6px',
                bgcolor: isPositiveTrend ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
                color: isPositiveTrend ? '#10B981' : '#EF4444',
              }}
            >
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 700 }}>
                {isPositiveTrend ? '↑' : '↓'}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: isPositiveTrend ? '#10B981' : '#EF4444',
                fontWeight: 600,
                fontSize: '0.6875rem',
              }}
            >
              {isPositiveTrend ? '+' : ''}{trend.value}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#AAB5C2', fontSize: '0.6875rem' }}
            >
              {trend.label}
            </Typography>
          </Box>
        )}

        {/* Decorative Corner */}
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(color, 0.05)} 0%, transparent 70%)`,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default StatCard;