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
  Avatar,
  Chip,
  Button,
  Typography,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

// Mock data
const mockMembers: Member[] = [
  { id: '1', name: 'Budi Santoso', email: 'budi.santoso@email.com', phone: '081234567890', points: 12500, status: 'active', joinDate: '15 Jan 2026' },
  { id: '2', name: 'Siti Rahayu', email: 'siti.rahayu@email.com', phone: '081234567891', points: 8500, status: 'active', joinDate: '12 Jan 2026' },
  { id: '3', name: 'Ahmad Wijaya', email: 'ahmad.wijaya@email.com', phone: '081234567892', points: 3200, status: 'pending', joinDate: '10 Jan 2026' },
  { id: '4', name: 'Dewi Lestari', email: 'dewi.lestari@email.com', phone: '081234567893', points: 15800, status: 'active', joinDate: '08 Jan 2026' },
  { id: '5', name: 'Rudi Hermawan', email: 'rudi.hermawan@email.com', phone: '081234567894', points: 5600, status: 'inactive', joinDate: '05 Jan 2026' },
  { id: '6', name: 'Wati Susilowati', email: 'wati.susilowati@email.com', phone: '081234567895', points: 9200, status: 'active', joinDate: '03 Jan 2026' },
  { id: '7', name: 'Joko Pramono', email: 'joko.pramono@email.com', phone: '081234567896', points: 4100, status: 'active', joinDate: '01 Jan 2026' },
  { id: '8', name: 'Nina Marlina', email: 'nina.marlina@email.com', phone: '081234567897', points: 2300, status: 'pending', joinDate: '28 Dec 2025' },
  { id: '9', name: 'Hendra Wijaya', email: 'hendra.wijaya@email.com', phone: '081234567898', points: 7800, status: 'active', joinDate: '20 Dec 2025' },
  { id: '10', name: 'Rina Susilowati', email: 'rina.susilowati@email.com', phone: '081234567899', points: 15200, status: 'active', joinDate: '15 Dec 2025' },
];

const statusConfig = {
  active: { label: 'Aktif', color: 'success' },
  inactive: { label: 'Nonaktif', color: 'default' },
  pending: { label: 'Menunggu', color: 'warning' },
};

const Members = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase()) ||
      member.phone.includes(search);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <PageHeader
        title="Kelola Member"
        subtitle="Kelola dan lihat data member TPS3R"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              },
            }}
          >
            Tambah Member
          </Button>
        }
      />

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
        {[
          { label: 'Total Member', value: mockMembers.length.toString(), color: '#2E7D32' },
          { label: 'Member Aktif', value: mockMembers.filter(m => m.status === 'active').length.toString(), color: '#10B981' },
          { label: 'Menunggu Verifikasi', value: mockMembers.filter(m => m.status === 'pending').length.toString(), color: '#F59E0B' },
          { label: 'Total Poin', value: mockMembers.reduce((acc, m) => acc + m.points, 0).toLocaleString(), color: '#6366F1' },
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

      {/* Search & Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Cari nama, email, atau telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 280 }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9CA3AF' }} /></InputAdornment>,
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="all">Semua</MenuItem>
                <MenuItem value="active">Aktif</MenuItem>
                <MenuItem value="pending">Menunggu</MenuItem>
                <MenuItem value="inactive">Nonaktif</MenuItem>
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

      {/* Members Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nama</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No HP</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="right">Poin</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bergabung</TableCell>
                <TableCell sx={{ color: '#8898AA', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMembers.map((member) => {
                const status = statusConfig[member.status];
                return (
                  <TableRow key={member.id} sx={{ '&:hover': { bgcolor: '#F8FAF8' }, '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, fontSize: '0.8125rem', fontWeight: 600, bgcolor: '#F5F7F5', color: '#5A6978' }}>
                          {getInitials(member.name)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A2E' }}>{member.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: '#5A6978' }}>{member.email}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: '#5A6978' }}>{member.phone}</Typography></TableCell>
                    <TableCell align="right"><Typography variant="body2" sx={{ fontWeight: 600, color: '#2E7D32' }}>{member.points.toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Chip label={status.label} size="small" color={status.color as 'success' | 'warning' | 'default'} sx={{ height: 24, fontSize: '0.6875rem', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell><Typography variant="caption" sx={{ color: '#AAB5C2' }}>{member.joinDate}</Typography></TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Detail"><IconButton size="small" sx={{ borderRadius: '8px', '&:hover': { bgcolor: alpha('#2E7D32', 0.08) } }}><VisibilityIcon sx={{ fontSize: 18, color: '#8898AA' }} /></IconButton></Tooltip>
                        <Tooltip title="Edit"><IconButton size="small" sx={{ borderRadius: '8px', '&:hover': { bgcolor: alpha('#2E7D32', 0.08) } }}><EditIcon sx={{ fontSize: 18, color: '#8898AA' }} /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <PeopleIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#8898AA' }}>Tidak ada data member</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filteredMembers.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[5, 10, 25]} sx={{ borderTop: '1px solid #F0F2F5' }} />
      </Card>
    </Box>
  );
};

export default Members;