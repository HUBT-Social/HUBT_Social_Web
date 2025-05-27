import React from 'react';
import {
  Card,
  Avatar,
  message,
  Switch,
  Typography,
  Button,
  Tooltip,
} from 'antd';
import { UserOutlined, EditOutlined,} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  updateTheme,
  selectSettings,
  Settings,
} from '../../../store/slices/settingSlice';
import { selectUserInfo } from '../../../store/slices/authSlice';

const { Title, Text } = Typography;

const SettingAndProfile: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const user = useSelector(selectUserInfo);

  // Handle setting changes
  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    dispatch(updateTheme(newSettings));
    message.success('Cập nhật cài đặt thành công!');
  };

  // Copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    message.success(`Đã sao chép màu ${color}`);
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className={`min-h-screen p-6 bg-gray-100`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card
            title={<span className="text-lg font-semibold">Hồ sơ cá nhân</span>}
            className={`shadow-lg rounded-xl overflow-hidden ${
              settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
            extra={
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => message.info('Chức năng chỉnh sửa hồ sơ đang phát triển')}
                className="text-blue-500 hover:text-blue-600"
              >
                Chỉnh sửa
              </Button>
            }
          >
            <div className="flex flex-col md:flex-row items-center gap-8 p-4">
              <Avatar
                size={140}
                src={user?.avatarUrl}
                icon={<UserOutlined />}
                className="border-4 border-blue-500"
              />
              <div className="text-center md:text-left">
                <Title level={3} className={`m-0 ${settings.darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {user ? `${user.firstName} ${user.lastName}` : 'N/A'}
                </Title>
                <Text className={`text-base ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  @{user?.userName || 'unknown'}
                </Text>
                <div className="mt-4 space-y-2">
                  <div>
                    <Text strong className={settings.darkMode ? 'text-gray-200' : 'text-gray-700'}>
                      Email:{' '}
                    </Text>
                    <Text className={settings.darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {user?.email || 'Chưa cập nhật'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.2 }}
        >
          <Card
            title={<span className="text-lg font-semibold">Cài đặt tài khoản</span>}
            className={`shadow-lg rounded-xl ${
              settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <div className="space-y-4 p-4">
              <Title level={5} className={settings.darkMode ? 'text-white' : 'text-gray-800'}>
                Giao diện & Ngôn ngữ
              </Title>
              <div className="flex items-center justify-between py-2">
                <Tooltip title="Bật/tắt chế độ tối">
                  <Text className={settings.darkMode ? 'text-gray-200' : 'text-gray-700'}>Chế độ tối</Text>
                </Tooltip>
                <Switch
                  checked={settings.darkMode}
                  onChange={(checked) => handleSettingChange('darkMode', checked)}
                  className="bg-gray-400"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Tooltip title="Bật/tắt ngôn ngữ địa phương (tiếng Việt)">
                  <Text className={settings.darkMode ? 'text-gray-200' : 'text-gray-700'}>Ngôn ngữ (Localization)</Text>
                </Tooltip>
                <Switch
                  checked={settings.localization}
                  onChange={(checked) => handleSettingChange('localization', checked)}
                  className="bg-gray-400"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Color Testing Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.4 }}
        >
          <Card
            title={<span className="text-lg font-semibold">Kiểm tra màu sắc</span>}
            className={`shadow-lg rounded-xl ${
              settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {[
                {
                  label: 'Background',
                  var: '--background',
                  color: settings.darkMode ? '#2A3334' : '#F9F4FA',
                },
                {
                  label: 'Text',
                  var: '--text-color',
                  color: settings.darkMode ? '#FFFFFF' : '#2A3334',
                },
                {
                  label: 'Primary',
                  var: '--primary',
                  color: settings.darkMode ? '#00F980' : '#00D76B',
                },
                {
                  label: 'Card Background',
                  var: '--card-bg',
                  color: settings.darkMode ? '#2A2A2A' : '#FFFFFF',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <Text className={settings.darkMode ? 'text-gray-200' : 'text-gray-700'}>{item.label}:</Text>
                  <Tooltip title="Nhấn để sao chép mã màu">
                    <div
                      className="w-10 h-10 rounded border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: `var(${item.var})` }}
                      onClick={() => copyToClipboard(item.color)}
                    />
                  </Tooltip>
                  <Text
                    className={`cursor-pointer hover:underline ${settings.darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    onClick={() => copyToClipboard(item.color)}
                  >
                    {item.color}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingAndProfile;