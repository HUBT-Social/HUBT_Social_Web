import { Bell, Calendar, Eye, Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { UINotification } from './notification-screen.types';
import { selectNotificationHistory } from '../../../../store/slices/notificationSlice';
import { JSX } from 'react';

interface DashboardProps {
  getStatusIcon: (status: string) => JSX.Element;
  getPriorityColor: (priority: string) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ getStatusIcon, getPriorityColor }) => {
  const notifications = useSelector(selectNotificationHistory) as UINotification[];

  const stats = {
    totalNotifications: notifications.length,
    sentNotifications: notifications.filter((n) => n.status === 'sent').length,
    scheduledNotifications: notifications.filter((n) => n.status === 'scheduled').length,
    totalRecipients: notifications.reduce((sum, n) => sum + n.recipients, 0),
    averageReadRate: notifications.length > 0
      ? (
          notifications.reduce((sum, n) => sum + (n.readCount / n.recipients * 100), 0) /
          notifications.length
        ).toFixed(1)
      : '0',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng thông báo</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalNotifications}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã gửi</p>
              <p className="text-2xl font-bold text-green-600">{stats.sentNotifications}</p>
            </div>
            <Send className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã lên lịch</p>
              <p className="text-2xl font-bold text-orange-600">{stats.scheduledNotifications}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tỷ lệ đọc TB</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageReadRate}%</p>
            </div>
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông báo gần đây</h2>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(notification.status)}
                <div>
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.time}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                  notification.priority
                )}`}
              >
                {notification.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;