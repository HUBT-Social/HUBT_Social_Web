import { Notification } from '../../../../types/Notification';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin: string;
}

// Định nghĩa lại Notification để đồng bộ với type từ Redux
export interface UINotification extends Notification {
  readCount: number;
  recipients: number;
}