import { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, Button, Avatar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  NotificationsOutlined as NotificationsIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Profil Admin', icon: <PersonIcon /> },
    { label: 'Ubah Password', icon: <LockIcon /> },
    { label: 'Notifikasi', icon: <NotificationsIcon /> },
    { label: 'Pengaturan Sistem', icon: <SettingsIcon /> },
  ];

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactionAlerts: true,
    weeklyDigest: true,
    marketing: false,
  });

  return (
    <Box>
      <PageHeader title="Pengaturan" subtitle="Kelola profil dan pengaturan sistem" />

      <Grid container spacing={3}>
        {/* Settings Navigation */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: 'fit-content' }}>
            <List sx={{ p: 1 }}>
              {tabs.map((tab, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    selected={activeTab === index}
                    onClick={() => setActiveTab(index)}
                    sx={{ borderRadius: '12px', mb: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: activeTab === index ? '#2E7D32' : '#8898AA' }}>
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={tab.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.875rem',
                            fontWeight: activeTab === index ? 600 : 400,
                            color: activeTab === index ? '#2E7D32' : '#5A6978'
                          }
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Settings Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {activeTab === 0 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Profil Admin</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', fontWeight: 600, bgcolor: '#2E7D32' }}>A</Avatar>
                    <Button size="small" sx={{ position: 'absolute', bottom: 0, right: 0, minWidth: 32, height: 32, borderRadius: '50%', p: 0 }}>
                      <SecurityIcon sx={{ fontSize: 16 }} />
                    </Button>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Admin TPS3R</Typography>
                    <Typography variant="body2" sx={{ color: '#8898AA' }}>admin@tps3r.com</Typography>
                    <Typography variant="caption" sx={{ color: '#AAB5C2' }}>Terakhir login: 15 Jan 2026, 14:30</Typography>
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Nama Lengkap" defaultValue="Admin TPS3R" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" defaultValue="admin@tps3r.com" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Role" defaultValue="Super Admin" size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="No. Telepon" defaultValue="081234567890" size="small" />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<SaveIcon />} sx={{ px: 4, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}>
                    Simpan Perubahan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === 1 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Ubah Password</Typography>
                <Typography variant="body2" sx={{ color: '#8898AA', mb: 3 }}>Pastikan password yang Anda gunakan cukup kuat dan mudah diingat</Typography>
                <Box sx={{ maxWidth: 500 }}>
                  <TextField fullWidth label="Password Saat Ini" type="password" placeholder="Masukkan password saat ini" size="small" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Password Baru" type="password" placeholder="Masukkan password baru" size="small" sx={{ mb: 2 }} />
                  <TextField fullWidth label="Konfirmasi Password Baru" type="password" placeholder="Masukkan ulang password baru" size="small" sx={{ mb: 3 }} />
                  <Button variant="contained" startIcon={<LockIcon />} sx={{ px: 4, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}>
                    Update Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === 2 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Pengaturan Notifikasi</Typography>
                <Typography variant="body2" sx={{ color: '#8898AA', mb: 3 }}>Atur bagaimana Anda menerima notifikasi dari sistem</Typography>
                <Box sx={{ maxWidth: 500 }}>
                  <Typography variant="overline" sx={{ color: '#AAB5C2', display: 'block', mb: 1 }}>Saluran Notifikasi</Typography>
                  <Card variant="outlined" sx={{ mb: 3, bgcolor: '#F8FAFC', border: '1px solid #E8ECEF' }}>
                    <List disablePadding>
                      <ListItem><Switch checked={notifications.email} onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })} /><ListItemText primary="Email" /></ListItem>
                      <ListItem><Switch checked={notifications.push} onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })} /><ListItemText primary="Push Notification" /></ListItem>
                    </List>
                  </Card>
                  <Typography variant="overline" sx={{ color: '#AAB5C2', display: 'block', mb: 1, mt: 2 }}>Jenis Notifikasi</Typography>
                  <Card variant="outlined" sx={{ bgcolor: '#F8FAFC', border: '1px solid #E8ECEF' }}>
                    <List disablePadding>
                      <ListItem><Switch checked={notifications.transactionAlerts} onChange={(e) => setNotifications({ ...notifications, transactionAlerts: e.target.checked })} /><ListItemText primary="Pemberitahuan Transaksi Baru" /></ListItem>
                      <ListItem><Switch checked={notifications.weeklyDigest} onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })} /><ListItemText primary="Ringkasan Mingguan" /></ListItem>
                      <ListItem><Switch checked={notifications.marketing} onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })} /><ListItemText primary="Informasi dan Promo" /></ListItem>
                    </List>
                  </Card>
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === 3 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Pengaturan Sistem</Typography>
                <Typography variant="body2" sx={{ color: '#8898AA', mb: 3 }}>Konfigurasi umum sistem TPS3R</Typography>
                <Grid container spacing={2} sx={{ maxWidth: 600 }}>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Nama Aplikasi" defaultValue="TPS3R Admin" size="small" slotProps={{ input: { readOnly: true } }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Versi Aplikasi" defaultValue="1.0.0" size="small" slotProps={{ input: { readOnly: true } }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Batas Ukuran File (MB)" defaultValue="10" size="small" /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="URL API" defaultValue="https://api.tps3r.com" size="small" /></Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<SaveIcon />} sx={{ px: 4, background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}>
                    Simpan Pengaturan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;