// Navigation & Layout Types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
}

// Member Types
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  avatar?: string;
}

export interface MemberFilters {
  search?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Transaction Types
export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  wasteType: string;
  weight: number;
  points: number;
  date: string;
  time: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface TransactionFilters {
  search?: string;
  status?: string;
  wasteType?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Waste Types
export type WasteType =
  | 'organic'
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'glass'
  | 'cloth'
  | 'rubber'
  | 'other';

export interface WasteCategory {
  id: WasteType;
  name: string;
  icon: string;
  color: string;
  pointsPerKg: number;
}

// Verification Types
export interface VerificationItem {
  id: string;
  transactionId: string;
  memberId: string;
  memberName: string;
  wasteType: string;
  weight: number;
  submittedAt: string;
  photoUrl?: string;
  notes?: string;
}

// Education Types
export interface EducationArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  viewCount: number;
}

export interface EducationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

// Report Types
export interface ReportSummary {
  totalMembers: number;
  totalTransactions: number;
  totalWasteKg: number;
  totalPoints: number;
  averageTransactionWeight: number;
  mostActiveMember: string;
  topWasteType: string;
}

export interface MonthlyData {
  month: string;
  members: number;
  transactions: number;
  wasteKg: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Activity Types
export interface Activity {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  action: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

// Dashboard Types
export interface DashboardStats {
  totalMembers: number;
  totalMembersGrowth: number;
  totalTransactions: number;
  totalTransactionsGrowth: number;
  totalWasteKg: number;
  totalWasteKgGrowth: number;
  totalPoints: number;
  totalPointsGrowth: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  fill?: boolean;
}

// Settings Types
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  lastLogin: string;
}

export interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  validation?: (value: unknown) => string | null;
  options?: { label: string; value: string }[];
}

// Table Types
export interface TableColumn<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown, row: T) => React.ReactNode;
}

export interface TablePagination {
  page: number;
  rowsPerPage: number;
  total: number;
}

// Status Types
export type StatusType = 'active' | 'inactive' | 'pending' | 'verified' | 'rejected' | 'success' | 'failed';

export interface StatusConfig {
  label: string;
  color: 'success' | 'warning' | 'error' | 'info' | 'default';
  icon?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}