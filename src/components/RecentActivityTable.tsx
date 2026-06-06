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
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  alpha,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface Activity {
  id: string;
  memberName: string;
  memberAvatar?: string;
  action: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

interface RecentActivityTableProps {
  title?: string;
  activities: Activity[];
  maxRows?: number;
}

const statusConfig = {
  success: { label: 'Berhasil', dotColor: '#2E7D32' },
  pending: { label: 'Menunggu', dotColor: '#F59E0B' },
  failed: { label: 'Gagal', dotColor: '#EF4444' },
};

const RecentActivityTable = ({
  title = 'Aktivitas Terbaru',
  activities,
  maxRows = 5,
}: RecentActivityTableProps) => {
  const displayedActivities = activities.slice(0, maxRows);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid #F0F2F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A1A2E' }}>
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#2E7D32',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Lihat Semua <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </Typography>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '30%', color: '#8898AA', fontSize: '0.6875rem' }}>Member</TableCell>
                <TableCell sx={{ width: '32%', color: '#8898AA', fontSize: '0.6875rem' }}>Aktivitas</TableCell>
                <TableCell sx={{ width: '18%', color: '#8898AA', fontSize: '0.6875rem' }}>Waktu</TableCell>
                <TableCell sx={{ width: '12%', color: '#8898AA', fontSize: '0.6875rem' }}>Status</TableCell>
                <TableCell sx={{ width: '8%' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedActivities.map((activity) => {
                const status = statusConfig[activity.status];
                return (
                  <TableRow
                    key={activity.id}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { bgcolor: '#F8FAFC' },
                    }}
                  >
                    {/* Member */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={activity.memberAvatar}
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            bgcolor: '#F5F7F5',
                            color: '#5A6978',
                          }}
                        >
                          {getInitials(activity.memberName)}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: '#1A1A2E',
                            maxWidth: 120,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {activity.memberName}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Activity */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#5A6978',
                          fontSize: '0.8125rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {activity.action}
                      </Typography>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#AAB5C2' }}>
                        {activity.date}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: status.dotColor,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: '#5A6978', fontWeight: 500 }}
                        >
                          {status.label}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Action */}
                    <TableCell>
                      <Tooltip title="Detail">
                        <IconButton
                          size="small"
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            '&:hover': { bgcolor: alpha('#2E7D32', 0.08) },
                          }}
                        >
                          <ArrowForwardIcon sx={{ fontSize: 16, color: '#AAB5C2' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Empty State */}
              {displayedActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#8898AA' }}>
                      Tidak ada aktivitas terbaru
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;