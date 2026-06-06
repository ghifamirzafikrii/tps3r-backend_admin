import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  InputAdornment,
  alpha,
  Snackbar,
  Alert,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Article as ArticleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import { educationService, type Education } from '../services/educationService';

type EducationItem = Education & {
  views?: number;
};

interface FormState {
  title: string;
  content: string;
  status: 'published' | 'draft';
  thumbnail: File | null;
}

const defaultForm: FormState = {
  title: '',
  content: '',
  status: 'draft',
  thumbnail: null,
};

const Education = () => {
  const [articles, setArticles] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<EducationItem | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await educationService.getAll();
      setArticles(data);
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Gagal memuat artikel', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateDialog = () => {
    setForm(defaultForm);
    setCreateDialogOpen(true);
  };

  const openEditDialog = (article: EducationItem) => {
    setSelectedArticle(article);
    setForm({
      title: article.title,
      content: article.content,
      status: article.status,
      thumbnail: null,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (article: EducationItem) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      showSnackbar('Judul artikel harus diisi', 'error');
      return;
    }
    if (!form.content.trim()) {
      showSnackbar('Konten artikel harus diisi', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await educationService.create(form);
      showSnackbar('Artikel berhasil dibuat');
      setCreateDialogOpen(false);
      setForm(defaultForm);
      await fetchArticles();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Gagal membuat artikel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedArticle) return;
    if (!form.title.trim()) {
      showSnackbar('Judul artikel harus diisi', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await educationService.update(selectedArticle.id, form);
      showSnackbar('Artikel berhasil diperbarui');
      setEditDialogOpen(false);
      setSelectedArticle(null);
      await fetchArticles();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Gagal memperbarui artikel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    setSubmitting(true);
    try {
      await educationService.delete(selectedArticle.id);
      showSnackbar('Artikel berhasil dihapus');
      setDeleteDialogOpen(false);
      setSelectedArticle(null);
      await fetchArticles();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Gagal menghapus artikel', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    views: articles.reduce((sum, a) => sum + (a.views || 0), 0),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(s => ({ ...s, thumbnail: file }));
    }
  };

  return (
    <Box>
      <PageHeader
        title="Edukasi"
        subtitle="Kelola artikel edukasi"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{
              px: 3,
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
              },
            }}
          >
            Tambah Artikel
          </Button>
        }
      />

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 3 }}>
        {[
          { label: 'Total Artikel', value: stats.total },
          { label: 'Artikel Terbit', value: stats.published },
          { label: 'Total Views', value: stats.views.toLocaleString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ color: '#8898AA', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1A1A2E' }}>
                {loading ? <Skeleton width={60} /> : stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9CA3AF' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <CloseIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
              sx={{ flex: 1 }}
            />
            <Chip
              label={`${filtered.length} Artikel`}
              sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 500 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      {loading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
                <Skeleton variant="rectangular" width={120} height={80} sx={{ borderRadius: 2, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ArticleIcon sx={{ fontSize: 64, color: '#D1D5DB', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 1 }}>
              {search ? 'Artikel tidak ditemukan' : 'Belum ada artikel edukasi'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 3 }}>
              {search ? `Tidak ada artikel yang cocok dengan "${search}"` : 'Mulai tambahkan artikel pertama Anda'}
            </Typography>
            {!search && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={openCreateDialog}
                sx={{ borderColor: '#E8ECEF', color: '#5A6978' }}
              >
                Tambah Artikel
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filtered.map((article) => (
            <Card key={article.id} sx={{ overflow: 'hidden' }}>
              {/* Thumbnail */}
              <Box sx={{ height: 160, position: 'relative', bgcolor: article.status === 'draft' ? '#FEF3C7' : '#F0FDF4' }}>
                {article.thumbnail_url ? (
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <ImageIcon sx={{ fontSize: 48, color: article.status === 'draft' ? '#D97706' : '#10B981', opacity: 0.4 }} />
                  </Box>
                )}
                {article.status === 'draft' && (
                  <Chip
                    label="Draft"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: '#F59E0B',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.6875rem',
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1A1A2E', mb: 1 }}>
                  {article.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {article.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {article.views?.toLocaleString() ?? 0} views
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" onClick={() => openEditDialog(article)}>
                      <EditIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => openDeleteDialog(article)}>
                      <DeleteIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Tambah Artikel</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Judul"
            value={form.title}
            onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ArticleIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            label="Konten"
            multiline
            rows={4}
            value={form.content}
            onChange={(e) => setForm(s => ({ ...s, content: e.target.value }))}
            placeholder="Tulis konten artikel..."
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm(s => ({ ...s, status: e.target.value as 'published' | 'draft' }))}
            slotProps={{ select: { native: true } }}
            sx={{ mb: 2 }}
          >
            <option value="draft">Draft - Simpan sebagai draft</option>
            <option value="published">Terbit - Publikasikan artikel</option>
          </TextField>
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
            sx={{ borderColor: '#E8ECEF', color: '#5A6978' }}
          >
            {form.thumbnail ? form.thumbnail.name : 'Unggah Thumbnail (opsional)'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: '#9CA3AF' }}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <ArticleIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              px: 3,
            }}
          >
            {submitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px' } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Artikel</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Judul"
            value={form.title}
            onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ArticleIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            label="Konten"
            multiline
            rows={4}
            value={form.content}
            onChange={(e) => setForm(s => ({ ...s, content: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm(s => ({ ...s, status: e.target.value as 'published' | 'draft' }))}
            slotProps={{ select: { native: true } }}
            sx={{ mb: 2 }}
          >
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
          </TextField>
          <Button
            component="label"
            variant="outlined"
            startIcon={<ImageIcon />}
            sx={{ borderColor: '#E8ECEF', color: '#5A6978' }}
          >
            {form.thumbnail ? form.thumbnail.name : 'Ganti Thumbnail'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#9CA3AF' }}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <EditIcon />}
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              px: 3,
            }}
          >
            {submitting ? 'Memperbarui...' : 'Perbarui'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '20px', textAlign: 'center', p: 3 } } }}
      >
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: alpha('#EF4444', 0.1),
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', mx: 'auto', mb: 2,
            }}
          >
            <DeleteIcon sx={{ fontSize: 32, color: '#EF4444' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Hapus Artikel?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {selectedArticle?.title}
          </Typography>
        </Box>
        <DialogActions sx={{ gap: 1, justifyContent: 'center' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ px: 3, borderColor: '#E8ECEF', color: '#5A6978', flex: 1 }}
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
            sx={{ flex: 1, background: '#EF4444', '&:hover': { background: '#DC2626' }, px: 3 }}
          >
            {submitting ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={hideSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={hideSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Education;