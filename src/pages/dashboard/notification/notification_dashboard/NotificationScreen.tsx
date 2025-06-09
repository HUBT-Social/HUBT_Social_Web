import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  FileText,
  Home,
  Menu,
  Plus,
  Settings,
  User,
  Users,
} from 'lucide-react';
import { UINotification } from './notification-screen.types';
import { AppDispatch } from '../../../../store/store';
import { getHistoryNotification, selectNotificationError, selectNotificationHistory, selectNotificationLoading } from '../../../../store/slices/notificationSlice';
import NotificationsManagement from './NotificationsManagement';
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';

const NotificationScreen: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState<UINotification | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotificationHistory) as UINotification[];
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);

  const loadHistoryNotification = () => {
    dispatch(
      getHistoryNotification({
        startAt: notifications?.length ?? 0,
        pageSize: 10,
      })
    );
  }

  // Tự động chạy loadHistoryNotification khi component được mount
  useEffect(() => {
    if (!hasInitialized) {
      loadHistoryNotification();
      setHasInitialized(true);
    }
  }, []); // Empty dependency array means this runs only once when component mounts

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4" />;
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const menuItems = [
    { key: 'dashboard', label: 'Tổng quan', icon: <Home className="w-5 h-5" /> },
    { key: 'notifications', label: 'Quản lý thông báo', icon: <Bell className="w-5 h-5" /> },
    { key: 'create', label: 'Tạo thông báo', icon: <Plus className="w-5 h-5" /> },
    { key: 'users', label: 'Quản lý người dùng', icon: <Users className="w-5 h-5" /> },
    { key: 'analytics', label: 'Thống kê', icon: <BarChart3 className="w-5 h-5" /> },
    { key: 'settings', label: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
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

    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard getStatusIcon={getStatusIcon} getPriorityColor={getPriorityColor} />;
      case 'notifications':
        return (
          <NotificationsManagement
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            setShowCreateModal={setShowCreateModal}
            setEditingNotification={setEditingNotification}
          />
        );
      case 'users':
        return <UsersManagement />;
      case 'analytics':
        return <></>;
      case 'settings':
        return <Settings />;
      default:
        return <></>; 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && <span className="text-xl font-bold text-gray-900">Admin Panel</span>}
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                activeMenu === item.key ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700' : 'text-gray-700'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default NotificationScreen;