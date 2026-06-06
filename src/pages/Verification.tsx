import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Avatar, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, alpha } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  CheckCircleOutlined as CheckCircleOutlineIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

interface VerificationItem {
  id: string;
  transactionId: string;
  memberName: string;
  wasteType: string;
  weight: number;
  points: number;
  submittedAt: string;
  notes?: string;
}

const mockItems: VerificationItem[] = [
  { id: '1', transactionId: 'TXN-001234', memberName: 'Ahmad Wijaya', wasteType: 'Organik', weight: 8.0, points: 1600, submittedAt: '15 Jan 2026, 12:00', notes: 'Sampah organik dari dapur' },
  { id: '2', transactionId: 'TXN-001235', memberName: 'Nina Marlina', wasteType: 'Organik', weight: 3.2, points: 640, submittedAt: '13 Jan 2026, 10:00', notes: 'Daun dan rumput kering' },
  { id: '3', transactionId: 'TXN-001236', memberName: 'Andi Pratama', wasteType: 'Plastik', weight: 4.5, points: 2250, submittedAt: '12 Jan 2026, 15:30', notes: 'Botol plastik dan kantong' },
  { id: '4', transactionId: 'TXN-001237', memberName: 'Rina Hartati', wasteType: 'Kertas', weight: 6.0, points: 3000, submittedAt: '11 Jan 2026, 09:15', notes: 'Koran dan kardus' },
  { id: '5', transactionId: 'TXN-001238', memberName: 'Dharma Kusuma', wasteType: 'Logam', weight: 2.8, points: 5600, submittedAt: '10 Jan 2026, 14:45' },
];

const Verification = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleViewDetails = (item: VerificationItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleApprove = () => {
    setDialogOpen(false);
    setSelectedItem(null);
  };

  const handleReject = () => {
    setDialogOpen(false);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    setRejectDialogOpen(false);
    setSelectedItem(null);
    setRejectReason('');
  };

  return (
    <Box>
      <PageHeader
        title="Verifikasi Setoran"
        subtitle="Verifikasi setoran sampah yang menunggu persetujuan"
      />

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 500 }}>Menunggu Verifikasi</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#92400E', mt: 0.5 }}>{mockItems.length}</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PendingIcon sx={{ color: '#92400E' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D1 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 500 }}>Hari Ini</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#065F46', mt: 0.5 }}>12</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ color: '#fff' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#3730A3', fontWeight: 500 }}>Total Poin Ditukar</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3730A3', mt: 0.5 }}>48.500</Typography>
                </Box>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>PTS</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Verification List */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #F0F2F5' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>Daftar Penantian Verifikasi</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {mockItems.map((item) => (
              <Card key={item.id} sx={{ mb: 2, border: '1px solid #E8ECEF', '&:last-child': { mb: 0 }, '&:hover': { borderColor: '#2E7D32' } }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Avatar sx={{ width: 48, height: 48, fontSize: '1rem', fontWeight: 600, bgcolor: '#F5F7F5', color: '#5A6978' }}>
                      {item.memberName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 150 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A1A2E' }}>{item.memberName}</Typography>
                      <Typography variant="caption" sx={{ color: '#8898AA', fontFamily: 'monospace' }}>{item.transactionId}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#5A6978' }}>{item.wasteType}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2E7D32' }}>{item.points.toLocaleString()} pts</Typography>
                      <Typography variant="caption" sx={{ color: '#8898AA' }}>{item.weight.toFixed(1)} kg</Typography>
                    </Box>
                    <Box sx={{ minWidth: 110, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#5A6978' }}>{item.submittedAt.split(',')[0]}</Typography>
                      <Chip label={item.submittedAt.split(',')[1]} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#F8FAF8', color: '#5A6978', mt: 0.5 }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Detail"><IconButton size="small" onClick={() => handleViewDetails(item)} sx={{ border: '1px solid #E8ECEF', borderRadius: '8px', '&:hover': { bgcolor: '#F8FAF8' } }}><CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#8898AA' }} /></IconButton></Tooltip>
                      <Tooltip title="Terima"><IconButton size="small" sx={{ border: '1px solid #E8ECEF', borderRadius: '8px', bgcolor: alpha('#10B981', 0.08), '&:hover': { bgcolor: alpha('#10B981', 0.15) } }}><CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} /></IconButton></Tooltip>
                      <Tooltip title="Tolak"><IconButton size="small" sx={{ border: '1px solid #E8ECEF', borderRadius: '8px', bgcolor: alpha('#EF4444', 0.08), '&:hover': { bgcolor: alpha('#EF4444', 0.15) } }}><CancelIcon sx={{ fontSize: 18, color: '#EF4444' }} /></IconButton></Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Detail Verifikasi</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, fontSize: '1.2rem', fontWeight: 600, bgcolor: '#F5F7F5', color: '#5A6978' }}>
                  {selectedItem.memberName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedItem.memberName}</Typography>
                  <Typography variant="caption" sx={{ color: '#8898AA', fontFamily: 'monospace' }}>{selectedItem.transactionId}</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8898AA', display: 'block' }}>Jenis Sampah</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedItem.wasteType}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8898AA', display: 'block' }}>Berat</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedItem.weight.toFixed(1)} Kg</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8898AA', display: 'block' }}>Poin</Typography><Typography variant="body1" sx={{ fontWeight: 600, color: '#2E7D32' }}>{selectedItem.points.toLocaleString()}</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption" sx={{ color: '#8898AA', display: 'block' }}>Waktu Pengajuan</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedItem.submittedAt}</Typography></Grid>
              </Grid>
              {selectedItem.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ color: '#8898AA' }}>Catatan</Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedItem.notes}</Typography>
                </Box>
              )}
              <Box sx={{ mt: 3, height: 150, bgcolor: '#F8FAF8', borderRadius: 2, border: '2px dashed #E8ECEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <ImageIcon sx={{ fontSize: 40, color: '#D1D5DB', mb: 1 }} />
                  <Typography variant="caption" sx={{ color: '#9CA3AF' }}>Foto Bukti Setoran</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" color="error" onClick={handleReject}>Tolak</Button>
          <Button variant="contained" color="success" onClick={handleApprove}>Terima</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Alasan Penolakan</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#8898AA', mb: 2 }}>Jelaskan alasan penolakan untuk member.</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Masukkan alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setRejectDialogOpen(false)}>Batal</Button>
          <Button variant="contained" color="error" onClick={handleConfirmReject}>Konfirmasi Tolak</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Verification;