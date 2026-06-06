import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Recycling as RecyclingIcon,
  Scale as ScaleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

const summaryStats = [
  { title: 'Total Member', value: '1,248', icon: <PeopleIcon />, growth: '+12%', color: '#2E7D32' },
  { title: 'Total Transaksi', value: '5,432', icon: <RecyclingIcon />, growth: '+8%', color: '#10B981' },
  { title: 'Total Sampah', value: '12.5 Ton', icon: <ScaleIcon />, growth: '+15%', color: '#F59E0B' },
  { title: 'Poin Didistribusi', value: '250K', icon: <StarIcon />, growth: '+5%', color: '#6366F1' },
];

const monthlyData = [
  { month: 'Jan', transactions: 890, waste: 2100, points: 42000 },
  { month: 'Feb', transactions: 920, waste: 2300, points: 46000 },
  { month: 'Mar', transactions: 980, waste: 2400, points: 48000 },
  { month: 'Apr', transactions: 1020, waste: 2600, points: 52000 },
  { month: 'Mei', transactions: 1080, waste: 2700, points: 54000 },
  { month: 'Jun', transactions: 540, waste: 1440, points: 28000 },
];

const wasteDistribution = [
  { type: 'Organik', amount: 4200, percentage: 33.5, color: '#10B981' },
  { type: 'Plastik', amount: 2800, percentage: 22.3, color: '#3B82F6' },
  { type: 'Kertas', amount: 2100, percentage: 16.7, color: '#F59E0B' },
  { type: 'Logam', amount: 1800, percentage: 14.4, color: '#8B5CF6' },
  { type: 'Kaca', amount: 1100, percentage: 8.8, color: '#06B6D4' },
  { type: 'Lainnya', amount: 540, percentage: 4.3, color: '#9CA3AF' },
];

const topMembers = [
  { rank: 1, name: 'Dewi Lestari', transactions: 145, points: 15800 },
  { rank: 2, name: 'Budi Santoso', transactions: 132, points: 12500 },
  { rank: 3, name: 'Siti Rahayu', transactions: 118, points: 8500 },
  { rank: 4, name: 'Wati Susilowati', transactions: 105, points: 9200 },
  { rank: 5, name: 'Ahmad Wijaya', transactions: 98, points: 3200 },
];

const Reports = () => {
  return (
    <Box>
      <PageHeader
        title="Laporan"
        subtitle="Lihat dan unduh laporan TPS3R"
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<PdfIcon />} sx={{ px: 3, borderColor: '#E8ECEF', color: '#5A6978', '&:hover': { borderColor: '#2E7D32', color: '#2E7D32' } }}>
              Export PDF
            </Button>
            <Button variant="outlined" startIcon={<ExcelIcon />} sx={{ px: 3, borderColor: '#E8ECEF', color: '#5A6978', '&:hover': { borderColor: '#2E7D32', color: '#2E7D32' } }}>
              Export Excel
            </Button>
          </Box>
        }
      />

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryStats.map((stat, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                      {stat.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A2E' }}>
                        {stat.value}
                      </Typography>
                      <Chip label={stat.growth} size="small" sx={{ height: 20, bgcolor: '#ECFDF5', color: '#10B981', fontWeight: 600, fontSize: '0.6875rem' }} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Report Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AssessmentIcon sx={{ color: '#2E7D32' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Laporan Bulanan</Typography>
                </Box>
                <Button size="small" startIcon={<DownloadIcon />} sx={{ color: '#2E7D32' }}>Unduh</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bulan</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Transaksi</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Sampah (Kg)</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Poin</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Rata-rata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyData.map((row) => (
                      <TableRow key={row.month} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                        <TableCell><Typography sx={{ fontWeight: 600, color: '#1A1A2E' }}>{row.month} 2026</Typography></TableCell>
                        <TableCell align="right"><Typography>{row.transactions.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography>{row.waste.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography sx={{ fontWeight: 600, color: '#2E7D32' }}>{row.points.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="caption" sx={{ color: '#AAB5C2' }}>{(row.waste / row.transactions).toFixed(1)} kg</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Waste Distribution */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <RecyclingIcon sx={{ color: '#2E7D32' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Distribusi Sampah</Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {wasteDistribution.map((item) => (
                  <Box key={item.type} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: item.color }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#5A6978' }}>{item.type}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A2E' }}>{item.amount.toLocaleString()} kg</Typography>
                    </Box>
                    <Box sx={{ height: 6, borderRadius: 3, bgcolor: '#F0F2F5', overflow: 'hidden' }}>
                      <Box sx={{ width: `${item.percentage}%`, height: '100%', borderRadius: 3, bgcolor: item.color }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Members */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PeopleIcon sx={{ color: '#2E7D32' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Top 5 Member Aktif</Typography>
                </Box>
                <Chip label="Juni 2026" size="small" sx={{ bgcolor: '#F8FAF8', color: '#5A6978', fontWeight: 500 }} />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>#</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '40%' }}>Nama</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }} align="right">Transaksi</TableCell>
                      <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '25%' }} align="right">Poin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topMembers.map((member) => (
                      <TableRow key={member.rank} sx={{ '&:hover': { bgcolor: '#F8FAFC' } }}>
                        <TableCell>
                          <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            bgcolor: member.rank === 1 ? '#FFD700' : member.rank === 2 ? '#C0C0C0' : member.rank === 3 ? '#CD7F32' : '#F5F7F5',
                            color: member.rank <= 3 ? '#fff' : '#2E7D32',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.875rem'
                          }}>
                            {member.rank}
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontWeight: 500, color: '#1A1A2E' }}>{member.name}</Typography></TableCell>
                        <TableCell align="right"><Typography sx={{ color: '#5A6978' }}>{member.transactions} transaksi</Typography></TableCell>
                        <TableCell align="right"><Typography sx={{ fontWeight: 600, color: '#2E7D32' }}>{member.points.toLocaleString()} pts</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;