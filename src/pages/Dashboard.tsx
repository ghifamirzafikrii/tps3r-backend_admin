import { Box, Grid, Card, CardContent, Typography, alpha } from '@mui/material';
import {
  PeopleOutlined as PeopleIcon,
  Sync as TransactionsIcon,
  ScaleOutlined as ScaleIcon,
  StarsOutlined as PointsIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import RecentActivityTable from '../components/RecentActivityTable';
import PageHeader from '../components/PageHeader';

// Mock data for activities
const recentActivities = [
  {
    id: '1',
    memberName: 'Budi Santoso',
    action: 'Menyetor 5kg Plastik +250 pts',
    date: 'Baru saja',
    status: 'success' as const,
  },
  {
    id: '2',
    memberName: 'Siti Rahayu',
    action: 'Menyetor 3kg Kertas +150 pts',
    date: '5 menit lalu',
    status: 'success' as const,
  },
  {
    id: '3',
    memberName: 'Ahmad Wijaya',
    action: 'Menunggu verifikasi setoran',
    date: '12 menit lalu',
    status: 'pending' as const,
  },
  {
    id: '4',
    memberName: 'Dewi Lestari',
    action: 'Menukar poin rewards',
    date: '25 menit lalu',
    status: 'success' as const,
  },
  {
    id: '5',
    memberName: 'Rudi Hermawan',
    action: 'Setoran ditolak',
    date: '1 jam lalu',
    status: 'failed' as const,
  },
];

// Mock monthly data
const monthlyData = [
  { month: 'Jul', value: 1840 },
  { month: 'Agt', value: 2100 },
  { month: 'Sep', value: 1980 },
  { month: 'Okt', value: 2350 },
  { month: 'Nov', value: 2680 },
  { month: 'Des', value: 2940 },
];

// Stats data
const stats = [
  {
    title: 'Total Member',
    value: '1,248',
    icon: <PeopleIcon sx={{ fontSize: 22 }} />,
    trend: { value: 12, label: 'dari bulan lalu' },
    color: '#6366F1',
  },
  {
    title: 'Transaksi',
    value: '5,432',
    icon: <TransactionsIcon sx={{ fontSize: 22 }} />,
    trend: { value: 8, label: 'dari bulan lalu' },
    color: '#2E7D32',
  },
  {
    title: 'Total Sampah',
    value: '12.5 Ton',
    icon: <ScaleIcon sx={{ fontSize: 22 }} />,
    trend: { value: 15, label: 'dari bulan lalu' },
    color: '#F59E0B',
  },
  {
    title: 'Poin Didistribusi',
    value: '250K',
    icon: <PointsIcon sx={{ fontSize: 22 }} />,
    trend: { value: 5, label: 'dari bulan lalu' },
    color: '#EC4899',
  },
];

// Setoran Chart Component
const SetoranChart = () => {
  const maxValue = Math.max(...monthlyData.map((d) => d.value));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A1A2E' }}>
              Tren Setoran
            </Typography>
            <Typography variant="caption" sx={{ color: '#8898AA' }}>
              Dalam 6 bulan terakhir
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              py: 0.75,
              borderRadius: '8px',
              bgcolor: alpha('#10B981', 0.1),
              color: '#10B981',
            }}
          >
            <ArrowUpIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              +18.2%
            </Typography>
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 180, mt: 2 }}>
          {monthlyData.map((item, index) => {
            const heightPercent = (item.value / maxValue) * 100;
            const isLast = index === monthlyData.length - 1;
            return (
              <Box
                key={item.month}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8898AA',
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                  }}
                >
                  {item.value.toLocaleString()}
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: `${heightPercent}%`,
                    minHeight: 20,
                    borderRadius: '8px 8px 4px 4px',
                    background: isLast
                      ? 'linear-gradient(180deg, #2E7D32 0%, #4CAF50 100%)'
                      : 'linear-gradient(180deg, #E8ECEF 0%, #D1D5DB 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scaleY(1.02)',
                      transformOrigin: 'bottom',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: isLast ? '#2E7D32' : '#AAB5C2',
                    fontWeight: isLast ? 600 : 500,
                    fontSize: '0.6875rem',
                  }}
                >
                  {item.month}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

// Distribution Chart Component
const DistributionChart = () => {
  const data = [
    { label: 'Setoran', value: 3420, color: '#2E7D32', percent: 58 },
    { label: 'Penukaran', value: 1530, color: '#6366F1', percent: 26 },
    { label: 'Verifikasi', value: 940, color: '#F59E0B', percent: 16 },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A1A2E' }}>
            Distribusi Aktivitas
          </Typography>
          <Typography variant="caption" sx={{ color: '#8898AA' }}>
            Ringkasan aktivitas bulan ini
          </Typography>
        </Box>

        {/* Donut Chart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            sx={{
              position: 'relative',
              width: 130,
              height: 130,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `conic-gradient(
                  ${data.map((item, i) => {
                    const startAngle = data.slice(0, i).reduce((sum, d) => sum + d.percent, 0);
                    return `${item.color} ${startAngle}% ${startAngle + item.percent}%`;
                  }).join(', ')}
                )`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A2E', fontSize: '1.25rem' }}>
                5.8K
              </Typography>
              <Typography variant="caption" sx={{ color: '#AAB5C2', fontSize: '0.625rem' }}>
                Total
              </Typography>
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ flex: 1 }}>
            {data.map((item) => (
              <Box key={item.label} sx={{ mb: 1.5, '&:last-child': { mb: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: item.color }} />
                    <Typography variant="body2" sx={{ color: '#5A6978', fontSize: '0.8125rem' }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1A1A2E' }}>
                    {item.value.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: '#F0F2F5',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${item.percent}%`,
                      height: '100%',
                      borderRadius: 2,
                      bgcolor: item.color,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang! Berikut ringkasan aktivitas TPS3R."
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SetoranChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <DistributionChart />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <RecentActivityTable
        title="Aktivitas Terbaru"
        activities={recentActivities}
        maxRows={5}
      />
    </Box>
  );
};

export default Dashboard;