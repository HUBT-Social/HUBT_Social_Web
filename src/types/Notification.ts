// ================================
// Core Data Interfaces
// ================================

/**
 * Represents a user in the system (student, teacher, or admin).
 */
export interface User {
  userName: string;
  className: string | null; // Allow null for users without a class (e.g., teachers, admins)
  fullName: string;
  avatar: string | null; // Allow null for users without an avatar
  role: UserRole;
}

/**
 * Represents a notification type with styling and icon information.
 */
export interface NotificationTypeOption {
  value: NotificationType;
  label: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  gradient: string;
}

/**
 * Represents a recent notification sent in the system.
 */
export interface RecentNotification {
  id: number;
  title: string;
  type: NotificationType;
  recipientCount: number; // Renamed for clarity
  timestamp: string; // ISO format (yyyy-mm-ddTHH:mm:ss)
  status: DeliveryStatusType;
}

/**
 * Represents statistics for notifications.
 */
export interface NotificationStats {
  totalSent: number;
  todaySent: number;
  deliveryRate: number; // Percentage (0-100)
  readRate: number; // Percentage (0-100)
}

/**
 * Represents a reusable notification template.
 */
export interface NotificationTemplate {
  id: string;
  name: string; // Added for template identification
  type: NotificationType;
  title: string;
  content: string;
  variables: string[]; // Template variables (e.g., {{userName}})
  isDefault?: boolean;
  createdAt: string; // ISO format
  updatedAt?: string; // ISO format
}

/**
 * Represents a notification channel configuration.
 */
export interface NotificationChannel {
  id: string;
  name: string;
  type: ChannelType;
  isEnabled: boolean;
  config?: Record<string, unknown>;
  description?: string;
}

// ================================
// Form State Interfaces
// ================================

/**
 * Represents the data for a notification form.
 */
export interface NotificationFormData {
  title: string;
  body: string;
  type: NotificationType;
  requestId: string;
  priority: NotificationPriority;
  deliveryChannels: ChannelType[];
  scheduleEnabled: boolean;
  scheduledTime: string | null; // ISO format or null
}

/**
 * Represents filters for selecting notification recipients.
 */
export interface RecipientFilters {
  recipientType: RecipientType;
  facultyCodes: string[];
  courseCodes: string[];
  classCodes: string[];
  userNames: string[];
}

/**
 * Represents an uploaded image file for notifications.
 */
export interface ImageFile {
  file: string | ArrayBuffer | null; // Base64 string or file buffer
  fileName: string;
  previewUrl: string | ArrayBuffer | null;
}

// ================================
// UI State Interfaces
// ================================

/**
 * Represents form validation errors.
 */
export interface FormErrors {
  title?: string;
  body?: string;
  image?: string;
  recipients?: string;
  scheduledTime?: string;
  [key: string]: string | undefined;
}

/**
 * Represents a UI notification alert.
 */
export interface NotificationAlert {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

/**
 * Represents the UI state for the notification system.
 */
export interface UIState {
  isPreviewVisible: boolean;
  isLoading: boolean;
  isDragging: boolean;
  activeTab: 'dashboard' | 'compose' | 'history' | 'analytics' | 'settings';
  templateMode: boolean;
  selectedTemplate: string | null;
  previewDevice: 'mobile' | 'desktop' | 'email';
  searchTerm: string;
  filterType: NotificationType | '';
}

// ================================
// Component Props Interfaces
// ================================

/**
 * Props for the NotificationSender component.
 */
export interface NotificationSenderProps {
  initialUsers?: User[];
  onNotificationSent?: (data: NotificationPayload) => void;
  apiEndpoint?: string;
  enableAnalytics?: boolean;
}

/**
 * Represents the payload for sending a notification.
 */
export interface NotificationPayload {
  title: string;
  body: string;
  image: {
    base64String: string | ArrayBuffer | null;
    fileName: string;
  } | null;
  type: NotificationType;
  facultyCodes: string[];
  courseCodes: string[];
  classCodes: string[];
  userNames: string[];
  sendAll: boolean;
  scheduledTime: string | null; // ISO format or null
  priority: NotificationPriority;
  deliveryChannels: ChannelType[];
  requestId: string;
}

// ================================
// Hook State Interfaces
// ================================

/**
 * Represents the state for the notification form hook.
 */
export interface UseNotificationFormState extends NotificationFormData, RecipientFilters {
  imageFile: ImageFile | null;
  errors: FormErrors;
  notification: NotificationAlert | null;
}

/**
 * Represents the UI state for hooks.
 */
export interface UseUIState extends UIState {}

// ================================
// API Response Interfaces
// ================================

/**
 * Represents the response from a notification API call.
 */
export interface NotificationResponse {
  success: boolean;
  message: string;
  data?: {
    notificationId: string;
    recipientCount: number;
    scheduledFor?: string; // ISO format
  };
  error?: string;
}

/**
 * Represents analytics data for notifications.
 */
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
  typeDistribution: Record<NotificationType, number>;
  timeline: {
    date: string; // ISO format
    sent: number;
    delivered: number;
  }[];
}

// ================================
// Event Handler Interfaces
// ================================

/**
 * Represents event handlers for the notification system.
 */
export interface NotificationEventHandlers {
  onTitleChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onTypeChange: (value: NotificationType) => void;
  onRecipientTypeChange: (value: RecipientType) => void;
  onFacultyCodesChange: (values: string[]) => void;
  onCourseCodesChange: (values: string[]) => void;
  onClassCodesChange: (values: string[]) => void;
  onUserNamesChange: (values: string[]) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  onScheduleToggle: (enabled: boolean) => void;
  onScheduleTimeChange: (time: string | null) => void;
  onPriorityChange: (priority: NotificationPriority) => void;
  onDeliveryChannelsChange: (channels: ChannelType[]) => void;
  onTemplateSelect: (template: NotificationTemplate) => void;
  onTabChange: (tab: UIState['activeTab']) => void;
  onPreviewDeviceChange: (device: UIState['previewDevice']) => void;
}

// ================================
// Constants and Type Definitions
// ================================

export const NotificationTypes = {
  ACADEMIC: 'academic',
  ATTENDANCE: 'attendance',
  TUITION: 'tuition',
  EVENT: 'event',
  WARNING: 'warning',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  GRADE: 'grade',
  SCHEDULE: 'schedule',
  EMERGENCY: 'emergency',
} as const;

export type NotificationType = typeof NotificationTypes[keyof typeof NotificationTypes];

export const NotificationPriorities = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent', // Added for consistency with NotificationFormData
} as const;

export type NotificationPriority = typeof NotificationPriorities[keyof typeof NotificationPriorities];

export const DeliveryStatus = {
  SENT: 'sent',
  PENDING: 'pending',
  FAILED: 'failed',
  SCHEDULED: 'scheduled',
  DELIVERED: 'delivered', // Added for consistency with RecentNotification
  READ: 'read', // Added for consistency with RecentNotification
} as const;

export type DeliveryStatusType = typeof DeliveryStatus[keyof typeof DeliveryStatus];

export const ChannelTypes = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  IN_APP: 'in-app',
} as const;

export type ChannelType = typeof ChannelTypes[keyof typeof ChannelTypes];

export type UserRole = 'student' | 'teacher' | 'admin';
export type RecipientType = 'all' | 'specific';

// ================================
// Utility Type Guards
// ================================

/**
 * Checks if a string is a valid notification type.
 * @param type - The type to validate.
 * @returns True if the type is valid, false otherwise.
 */
export const isValidNotificationType = (type: string): type is NotificationType => {
  return Object.values(NotificationTypes).includes(type as NotificationType);
};

/**
 * Checks if a string is a valid priority level.
 * @param priority - The priority to validate.
 * @returns True if the priority is valid, false otherwise.
 */
export const isValidPriority = (priority: string): priority is NotificationPriority => {
  return Object.values(NotificationPriorities).includes(priority as NotificationPriority);
};

/**
 * Checks if a string is a valid recipient type.
 * @param type - The recipient type to validate.
 * @returns True if the type is valid, false otherwise.
 */
export const isValidRecipientType = (type: string): type is RecipientType => {
  return ['all', 'specific'].includes(type as RecipientType);
};

/**
 * Checks if a string is a valid user role.
 * @param role - The role to validate.
 * @returns True if the role is valid, false otherwise.
 */
export const isValidUserRole = (role: string): role is UserRole => {
  return ['student', 'teacher', 'admin'].includes(role as UserRole);
};

// ================================
// Form Validation Interfaces
// ================================

/**
 * Represents a validation rule for a form field.
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | undefined;
}

/**
 * Represents validation rules for the notification form.
 */
export interface ValidationRules {
  title: ValidationRule;
  body: ValidationRule;
  image: ValidationRule;
  recipients: ValidationRule;
  scheduledTime: ValidationRule;
}

/**
 * Represents the result of form validation.
 */
export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// ================================
// Settings Interfaces
// ================================

/**
 * Represents notification system settings.
 */
export interface NotificationSettings {
  autoSaveDrafts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultNotificationType: NotificationType;
  timeZone: string;
  language: string;
  templates: NotificationTemplate[];
}

// ================================
// Filter and Search Interfaces
// ================================

/**
 * Represents filters for searching notifications.
 */
export interface NotificationFilter {
  type?: NotificationType[];
  priority?: NotificationPriority[];
  status?: DeliveryStatusType[];
  dateRange?: [string, string]; // ISO format [start, end]
  recipients?: string[];
  channels?: ChannelType[];
}

/**
 * Represents sorting options for notifications.
 */
export interface SortOptions {
  field: 'date' | 'title' | 'type' | 'recipients' | 'status';
  direction: 'asc' | 'desc';
}

// ================================
// Additional Interfaces from Previous Submission
// ================================

/**
 * Represents a recipient in the notification system.
 */
export interface Recipient {
  key: string;
  name: string;
  faculty: string;
  class: string;
  gpa: number;
  absences: number;
  status: string;
  email: string;
  phone: string;
}

/**
 * Represents a notification history entry.
 */
export interface NotificationHistory {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  recipients: string[];
  timestamp: string; // ISO format
  readRate: number; // Percentage (0-100)
  deliveryStatus: DeliveryStatusType;
  channels: ChannelType[];
}

/**
 * Represents a saved group of recipients.
 */
export interface SavedGroup {
  name: string;
  keys: React.Key[];
  description?: string;
  createdAt: string; // ISO format
}

// ================================
// Integration with Previous Student Interface
// ================================

/**
 * Extends the Student interface to align with the User interface.
 */
export interface Student extends User, AverageScore {
  faculty: string;
  course: string;
  academicStatus: AcademicStatus;
  subjects?: AcademicPerformance[];
}

/**
 * Represents a student's average scores.
 */
export interface AverageScore {
  userName: string;
  gpa10: number;
  gpa4: number;
}

/**
 * Represents a student's performance in a subject.
 */
export interface AcademicPerformance {
  subjectName: string;
  score: number;
}

/**
 * Represents a student's academic status.
 */
export type AcademicStatus =
  | 'Excellent'
  | 'VeryGood'
  | 'Good'
  | 'FairlyGood'
  | 'Average'
  | 'Weak'
  | 'Poor'
  | 'MustDropOut';

/**
 * Validates a student object.
 * @param student - The object to validate.
 * @returns True if the object is a valid Student, false otherwise.
 */
// export const isValidStudent = (student: unknown): student is Student => {
//   if (typeof student !== 'object' || student === null) return false;

//   const s = student as Partial<Student>;
//   return (
//     typeof s.userName === 'string' &&
//     typeof s.fullName === 'string' &&
//     typeof s.faculty === 'string' &&
//     typeof s.course === 'string' &&
//     typeof s.gpa10 === 'number' &&
//     typeof s.gpa4 === 'number' &&
//     (s.className === null || typeof s.className === 'string') &&
//     (s.avatar === null || typeof s.avatar === 'string') &&
//     isValidUserRole(s.role)
//   );
// };
