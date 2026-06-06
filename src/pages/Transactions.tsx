import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Typography,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  SwapHoriz as TransactionsIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

interface Transaction {
  id: string;
  memberName: string;
  wasteType: string;
  wasteTypeLabel: string;
  weight: number;
  points: number;
  date: string;
  time: string;
  status: 'pending' | 'verified' | 'rejected';
}

const mockTransactions: Transaction[] = [
  { id: '1', memberName: 'Budi Santoso', wasteType: 'plastic', wasteTypeLabel: 'Plastik', weight: 5.2, points: 2600, date: '15 Jan 2026', time: '14:30', status: 'verified' },
  { id: '2', memberName: 'Siti Rahayu', wasteType: 'paper', wasteTypeLabel: 'Kertas', weight: 3.5, points: 1750, date: '15 Jan 2026', time: '13:45', status: 'verified' },
  { id: '3', memberName: 'Ahmad Wijaya', wasteType: 'organic', wasteTypeLabel: 'Organik', weight: 8.0, points: 1600, date: '15 Jan 2026', time: '12:00', status: 'pending' },
  { id: '4', memberName: 'Dewi Lestari', wasteType: 'metal', wasteTypeLabel: 'Logam', weight: 2.1, points: 4200, date: '14 Jan 2026', time: '16:20', status: 'verified' },
  { id: '5', memberName: 'Rudi Hermawan', wasteType: 'glass', wasteTypeLabel: 'Kaca', weight: 4.3, points: 2150, date: '14 Jan 2026', time: '11:15', status: 'rejected' },
  { id: '6', memberName: 'Wati Susilowati', wasteType: 'plastic', wasteTypeLabel: 'Plastik', weight: 6.8, points: 3400, date: '14 Jan 2026', time: '09:30', status: 'verified' },
  { id: '7', memberName: 'Joko Pramono', wasteType: 'paper', wasteTypeLabel: 'Kertas', weight: 2.5, points: 1250, date: '13 Jan 2026', time: '15:45', status: 'verified' },
  { id: '8', memberName: 'Nina Marlina', wasteType: 'organic', wasteTypeLabel: 'Organik', weight: 3.2, points: 640, date: '13 Jan 2026', time: '10:00', status: 'pending' },
];

const wasteTypeColors: Record<string, string> = {
  organic: '#10B981',
  plastic: '#3B82F6',
  paper: '#F59E0B',
  metal: '#8B5CF6',
  glass: '#06B6D4',
  cloth: '#78716C',
  rubber: '#64748B',
  other: '#9CA3AF',
};

const statusConfig = {
  pending: { label: 'Menunggu', color: 'warning' },
  verified: { label: 'Diverifikasi', color: 'success' },
  rejected: { label: 'Ditolak', color: 'error' },
};

const Transactions = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('all');

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch = t.memberName.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesWaste = wasteTypeFilter === 'all' || t.wasteType === wasteTypeFilter;
    return matchesSearch && matchesStatus && matchesWaste;
  });

  const paginatedTransactions = filteredTransactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <PageHeader
        title="Transaksi Setoran"
        subtitle="Kelola transaksi setoran sampah member"
        actions={
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ px: 3, borderColor: '#E8ECEF', color: '#5A6978', '&:hover': { borderColor: '#2E7D32', color: '#2E7D32' } }}>
              Export
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} sx={{ px: 3, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)', boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)' }}>
              Tambah Transaksi
            </Button>
          </Box>
        }
      />

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        {[
          { label: 'Total Transaksi', value: mockTransactions.length.toString(), color: '#2E7D32' },
          { label: 'Diverifikasi', value: mockTransactions.filter(t => t.status === 'verified').length.toString(), color: '#10B981' },
          { label: 'Menunggu', value: mockTransactions.filter(t => t.status === 'pending').length.toString(), color: '#F59E0B' },
          { label: 'Total Poin', value: mockTransactions.reduce((acc, t) => acc + t.points, 0).toLocaleString(), color: '#6366F1' },
        ].map((stat, i) => (
          <Card key={i} sx={{ '&:hover': { transform: 'translateY(-2px)' } }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A1A2E', mt: 0.5 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Cari member atau ID transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 280 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF' }} /></InputAdornment> } }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">Semua</MenuItem>
                <MenuItem value="pending">Menunggu</MenuItem>
                <MenuItem value="verified">Diverifikasi</MenuItem>
                <MenuItem value="rejected">Ditolak</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Jenis Sampah</InputLabel>
              <Select value={wasteTypeFilter} label="Jenis Sampah" onChange={(e) => setWasteTypeFilter(e.target.value)}>
                <MenuItem value="all">Semua</MenuItem>
                <MenuItem value="organic">Organik</MenuItem>
                <MenuItem value="plastic">Plastik</MenuItem>
                <MenuItem value="paper">Kertas</MenuItem>
                <MenuItem value="metal">Logam</MenuItem>
                <MenuItem value="glass">Kaca</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Filter Lanjutan">
              <IconButton sx={{ border: '1px solid #E8ECEF', borderRadius: '10px', '&:hover': { bgcolor: '#F8FAF8' } }}>
                <FilterIcon sx={{ color: '#5A6978' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jenis</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Berat</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Poin</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tanggal</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((t) => {
                const status = statusConfig[t.status];
                const wasteColor = wasteTypeColors[t.wasteType] || wasteTypeColors.other;
                return (
                  <TableRow key={t.id} sx={{ '&:hover': { bgcolor: '#F8FAF8' }, '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell><Typography sx={{ fontFamily: 'monospace', fontWeight: 500, color: '#1A1A2E', fontSize: '0.8125rem' }}>#{t.id.padStart(4, '0')}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A2E' }}>{t.memberName}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: wasteColor }} />
                        <Typography variant="body2" sx={{ color: '#5A6978' }}>{t.wasteTypeLabel}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A2E' }}>{t.weight.toFixed(1)} kg</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>{t.points.toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1A1A2E' }}>{t.date}</Typography>
                      <Typography variant="caption" sx={{ color: '#AAB5C2' }}>{t.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={status.label} size="small" color={status.color as 'success' | 'warning' | 'error'} sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Detail">
                        <IconButton size="small" sx={{ borderRadius: '8px', '&:hover': { bgcolor: alpha('#2E7D32', 0.08) } }}>
                          <VisibilityIcon sx={{ fontSize: 18, color: '#8898AA' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <TransactionsIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#8898AA' }}>Tidak ada transaksi</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filteredTransactions.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} sx={{ borderTop: '1px solid #F0F2F5' }} />
      </Card>
    </Box>
  );
};

export default Transactions;