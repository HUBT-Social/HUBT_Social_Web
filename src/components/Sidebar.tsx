// components/layout/Sidebar.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  CreditCardOutlined,
  SettingOutlined,
  FileDoneOutlined,
  StarOutlined,
  BellOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Menu, Tag } from 'antd';
import { useEffect} from 'react';
import {selectUserInfo,getInfoUser,selectToken} from '../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import defaultAvatar from '../../public/logo.png';

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector(selectUserInfo);
  const token = useSelector(selectToken);
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
    console.log('User:', userInfo);
    if (userInfo === null && token?.accessToken) {
      dispatch(getInfoUser({ accessToken: token.accessToken }));
    }
  }, [userInfo, token, dispatch, getInfoUser]);

  // Xác định mục đang active
  const selectedKey = (() => {
    const path = location.pathname;
    if (path.includes('/dashboard/teachers')) return '/dashboard/teachers';
    if (path.includes('/dashboard/students')) return '/dashboard/students';
    if (path.includes('/dashboard/notition')) return '/dashboard/notition';
    if (path.includes('/dashboard/billing')) return '/dashboard/billing';
    if (path.includes('/dashboard/settings')) return '/dashboard/settings';
    if (path.includes('/dashboard/exams')) return '/dashboard/exams';
    if (path.includes('/dashboard/features')) return '/dashboard/features';
    return '/dashboard';
  })();

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    // Tự động đóng sidebar trên mobile sau khi chọn item
    if (window.innerWidth < 1024) { // Hoặc breakpoint Tailwind 'lg'
      onToggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed sm:relative w-64 h-screen bg-secondary-90 text-white flex flex-col z-10
                  transition-transform duration-300 ease-in-out
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center py-6 border-b border-white/10">
        <img
          src={userInfo?.avatarUrl || defaultAvatar}
          alt="Logo"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-sm mt-2 font-medium text-center px-2">
          {userInfo?.firstName + " "+ userInfo?.lastName}
        </span>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        className="flex-1 pt-4"
        style={{backgroundColor: 'var(--color-secondary-90)', borderInlineEnd: 'none' }}
      >
        <Menu.Item key="/dashboard" icon={<AppstoreOutlined />}>
          Dashboard
        </Menu.Item>

        <Menu.Item key="/dashboard/teachers" icon={<TeamOutlined />}>
          Teachers
        </Menu.Item>

        <Menu.Item key="/dashboard/students" icon={<UserOutlined />}>
          Students/ classes
        </Menu.Item>

        <Menu.Item key="/dashboard/notition" icon={<BellOutlined />}>
          Notification
        </Menu.Item>

        <Menu.Item key="/dashboard/billing" icon={<CreditCardOutlined />}>
          Billing
        </Menu.Item>

        <Menu.Item key="/dashboard/settings" icon={<SettingOutlined />}>
          Settings and profile
        </Menu.Item>

        <Menu.Item key="/dashboard/exams" icon={<FileDoneOutlined />}>
          Exams
        </Menu.Item>

        <Menu.Item key="/dashboard/features" icon={<StarOutlined />}>
          <div className="flex justify-between items-center">
            <span>Features</span>
            <Tag color="blue" style={{ fontSize: '10px', marginLeft: 8 }}>
              NEW
            </Tag>
          </div>
        </Menu.Item>
      </Menu>

      {/* Close button for mobile */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-4 right-4 text-white sm:hidden focus:outline-none"
      >
        <CloseOutlined style={{ fontSize: '20px' }} />
      </button>
    </aside>
  );
};

export default Sidebar;