// ================================
// Core Data Interfaces
// ================================

export interface User {
  userName: string;
  className: string;
  fullName: string;
  avatar: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface NotificationTypeOption {
  value: string;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  gradient: string;
}

export interface RecentNotification {
  id: number;
  title: string;
  type: string;
  recipients: number;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface NotificationStats {
  totalSent: number;
  todaySent: number;
  deliveryRate: number;
  readRate: number;
}

export interface NotificationTemplate {
  id: string;
  title: string;
  content: string;
}

// ================================
// Form State Interfaces
// ================================

export interface NotificationFormData {
  title: string;
  body: string;
  type: string;
  requestId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  deliveryChannels: string[];
  scheduleEnabled: boolean;
  scheduledTime: any; // Dayjs object from antd DatePicker
}

export interface RecipientFilters {
  recipientType: 'all' | 'specific';
  facultyCodes: string[];
  courseCodes: string[];
  classCodes: string[];
  userNames: string[];
}

export interface ImageFile {
  file: string | ArrayBuffer | null; // base64 string or file buffer
  fileName: string;
  previewUrl: string | ArrayBuffer | null;
}

// ================================
// UI State Interfaces
// ================================

export interface FormErrors {
  title?: string;
  body?: string;
  image?: string;
  recipients?: string;
  [key: string]: string | undefined;
}

export interface NotificationAlert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface UIState {
  isPreviewVisible: boolean;
  isLoading: boolean;
  isDragging: boolean;
  activeTab: 'dashboard' | 'compose' | 'history' | 'analytics' | 'settings';
  templateMode: boolean;
  selectedTemplate: string | null;
  previewDevice: 'mobile' | 'desktop' | 'email';
  searchTerm: string;
  filterType: string;
}

// ================================
// Component Props Interfaces
// ================================

export interface NotificationSenderProps {
  initialUsers?: User[];
  onNotificationSent?: (data: NotificationPayload) => void;
  apiEndpoint?: string;
  enableAnalytics?: boolean;
}

export interface NotificationPayload {
  title: string;
  body: string;
  image: {
    base64String: string | ArrayBuffer | null;
    fileName: string;
  } | null;
  type: string;
  facultyCodes: string[];
  courseCodes: string[];
  classCodes: string[];
  userNames: string[];
  sendAll: boolean;
  scheduledTime: any | null;
  priority: string;
  deliveryChannels: string[];
  requestId: string;
}

// ================================
// Hook State Interfaces
// ================================

export interface UseNotificationFormState extends NotificationFormData, RecipientFilters {
  imageFile: ImageFile | null;
  errors: FormErrors;
  notification: NotificationAlert | null;
}

export interface UseUIState extends UIState {}

// ================================
// API Response Interfaces
// ================================

export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: {
    notificationId: string;
    recipientCount: number;
    scheduledFor?: string;
  };
  error?: string;
}

export interface AnalyticsData {
  deliveryStats: {
    sent: number;
    delivered: number;
    failed: number;
    pending: number;
  };
  engagementStats: {
    opened: number;
    clicked: number;
    dismissed: number;
  };
  typeDistribution: {
    [key: string]: number;
  };
  timeline: {
    date: string;
    sent: number;
    delivered: number;
  }[];
}

// ================================
// Event Handler Interfaces
// ================================

export interface NotificationEventHandlers {
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onRecipientTypeChange: (value: 'all' | 'specific') => void;
  onFacultyCodesChange: (values: string[]) => void;
  onCourseCodesChange: (values: string[]) => void;
  onClassCodesChange: (values: string[]) => void;
  onUserNamesChange: (values: string[]) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  onScheduleToggle: (enabled: boolean) => void;
  onScheduleTimeChange: (time: any) => void;
  onPriorityChange: (priority: string) => void;
  onDeliveryChannelsChange: (channels: string[]) => void;
  onTemplateSelect: (template: NotificationTemplate) => void;
  onTabChange: (tab: string) => void;
  onPreviewDeviceChange: (device: 'mobile' | 'desktop' | 'email') => void;
}

// ================================
// Utility Type Guards
// ================================

export const isValidNotificationType = (type: string): boolean => {
  const validTypes = ['default', 'event', 'warning', 'announcement', 'reminder', 'urgent', 'success', 'info'];
  return validTypes.includes(type);
};

export const isValidPriority = (priority: string): priority is 'low' | 'normal' | 'high' | 'urgent' => {
  return ['low', 'normal', 'high', 'urgent'].includes(priority);
};

export const isValidRecipientType = (type: string): type is 'all' | 'specific' => {
  return ['all', 'specific'].includes(type);
};

export const isValidUserRole = (role: string): role is 'student' | 'teacher' | 'admin' => {
  return ['student', 'teacher', 'admin'].includes(role);
};

// ================================
// Form Validation Interfaces
// ================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
}

export interface ValidationRules {
  title: ValidationRule;
  body: ValidationRule;
  image: ValidationRule;
  recipients: ValidationRule;
  scheduledTime: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// ================================
// Settings Interfaces
// ================================

export interface NotificationSettings {
  autoSaveDrafts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultNotificationType: string;
  timeZone: string;
  language: string;
  templates: NotificationTemplate[];
}

// ================================
// Filter and Search Interfaces
// ================================

export interface SearchFilters {
  searchTerm: string;
  notificationType: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  status: string;
  priority: string;
}

export interface SortOptions {
  field: 'date' | 'title' | 'type' | 'recipients' | 'status';
  direction: 'asc' | 'desc';
}

// ================================
// Export all interfaces for easy importing
// ================================
