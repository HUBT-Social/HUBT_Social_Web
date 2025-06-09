import { JSX, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';

import { UINotification } from './notification-screen.types';
import { deleteNotification, selectNotificationError, selectNotificationHistory, selectNotificationLoading } from '../../../../store/slices/notificationSlice';
import { AppDispatch } from '../../../../store/store';

interface NotificationsManagementProps {
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
  setShowCreateModal: (show: boolean) => void;
  setEditingNotification: (notification: UINotification | null) => void;
}

const NotificationsManagement: React.FC<NotificationsManagementProps> = ({
  getStatusIcon,
  getStatusColor,
  getPriorityColor,
  setShowCreateModal,
  setEditingNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const notifications = useSelector(selectNotificationHistory) as UINotification[];
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);
  const dispatch = useDispatch<AppDispatch>();

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa ${selectedNotifications.length} thông báo?`)) {
      selectedNotifications.forEach((id) => dispatch(deleteNotification({ id })));
      setSelectedNotifications([]);
    }
  };

  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
      dispatch(deleteNotification({ id }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-800">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="sent">Đã gửi</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="draft">Bản nháp</option>
            <option value="failed">Thất bại</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="all">Tất cả độ ưu tiên</option>
            <option value="urgent">Khẩn cấp</option>
            <option value="high">Cao</option>
            <option value="medium">Trung bình</option>
            <option value="low">Thấp</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Đã chọn {selectedNotifications.length} thông báo</span>
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:bg-red-300"
                disabled={loading}
              >
                Xóa
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:bg-gray-300"
                disabled={loading}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedNotifications.length === filteredNotifications.length &&
                      filteredNotifications.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông báo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ ưu tiên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người nhận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ đọc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-500">
                        {notification.body.substring(0, 100)}...
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {notification.time} • {notification.createdBy}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        notification.status
                      )}`}
                    >
                      {getStatusIcon(notification.status)}
                      <span className="ml-1">{notification.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                        notification.priority
                      )}`}
                    >
                      {notification.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {notification.recipients.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {notification.recipients > 0
                      ? `${((notification.readCount / notification.recipients) * 100).toFixed(1)}%`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingNotification(notification)}
                        className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationsManagement;