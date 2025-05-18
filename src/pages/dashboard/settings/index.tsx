import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Switch,
  Divider,
  Typography,
} from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme, selectSettings, Settings } from '../../../store/slices/settingSlice';
import { UserInfo } from '../../../types/User';

const { Option } = Select;
const { Title, Text } = Typography;


const mockUser: UserInfo = {
  id: '123456',
  userName: 'dangvu',
  email: 'dangvu@example.com',
  avataUrl: 'https://i.pravatar.cc/150?img=13',
  phoneNumber: '0987654321',
  firstName: 'Vũ',
  lastName: 'Đặng',
  fcmToken: 'fcm-token-demo',
  status: 'Active',
  gender: 1,
  dateOfBirth: '2000-01-01',
  className: 'CNTT-K22',
};

const genderMap = ['Khác', 'Nam', 'Nữ'];

const SettingAndProfile: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);

  const [user, setUser] = useState<UserInfo>(mockUser);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();


  const showModal = () => {
    form.setFieldsValue({
      ...user,
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : undefined,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = (values: any) => {
    const updatedUser = {
      ...user,
      ...values,
      dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
    };
    setUser(updatedUser);
    message.success('Cập nhật hồ sơ thành công!');
    setIsModalVisible(false);
  };

  // Xử lý thay đổi cài đặt
  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    dispatch(updateTheme(newSettings));
    message.success('Cập nhật cài đặt thành công!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card
        title="Thông tin người dùng"
        extra={<Button icon={<EditOutlined />} onClick={showModal}>Chỉnh sửa</Button>}
        className="shadow-md rounded-lg"
      >
        <div className="flex flex-col items-center gap-6">
          <Avatar size={120} src={user.avataUrl} icon={<UserOutlined />} />
          <div className="text-center">
            <h2 className="text-xl font-semibold">{`${user.lastName} ${user.firstName}`}</h2>
            <p className="text-gray-600">{`@${user.userName}`}</p>
            <div>
              <strong className="mr-2">Email:</strong>
              <span>{user.email || 'Chưa có'}</span>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          initialValues={user}
        >
          <Form.Item name="avataUrl" label="Ảnh đại diện (URL)">
            <Input />
          </Form.Item>
          <Form.Item name="firstName" label="Tên" rules={[{ required: true, message: 'Nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Họ" rules={[{ required: true, message: 'Nhập họ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userName" label="Tên người dùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Option value={1}>Nam</Option>
              <Option value={2}>Nữ</Option>
              <Option value={0}>Khác</Option>
            </Select>
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="className" label="Lớp">
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </Modal>

      <Card title="Cài đặt tài khoản" className="shadow-md rounded-lg">
        <Title level={5}>Giao diện & Ngôn ngữ</Title>
        <div className="flex items-center justify-between py-2">
          <Text>Chế độ tối</Text>
          <Switch
            checked={settings.darkMode}
            onChange={(checked) => handleSettingChange('darkMode', checked)}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <Text>Ngôn ngữ (Localization)</Text>
          <Switch
            checked={settings.localization}
            onChange={(checked) => handleSettingChange('localization', checked)}
          />
        </div>
      </Card>

      {/* Card kiểm tra màu sắc */}
      <Card title="Kiểm tra màu sắc" className="shadow-md rounded-lg">
        <div className="space-y-4">
          {/* Background Color */}
          <div className="flex items-center gap-4">
            <Text>Background:</Text>
            <div
              className="w-12 h-12 border"
              style={{ backgroundColor: 'var(--background)' }}
            />
            <Text>{settings.darkMode ? '#2A3334' : '#F9F4FA'}</Text>
          </div>

          {/* Text Color */}
          <div className="flex items-center gap-4">
            <Text>Text:</Text>
            <div
              className="w-12 h-12 border"
              style={{ backgroundColor: 'var(--text-color)' }}
            />
            <Text>{settings.darkMode ? '#FFFFFF' : '#2A3334'}</Text>
          </div>

          {/* Primary Color */}
          <div className="flex items-center gap-4">
            <Text>Primary:</Text>
            <div
              className="w-12 h-12 border"
              style={{ backgroundColor: 'var(--primary)' }}
            />
            <Text>{settings.darkMode ? '#00F980' : '#00D76B'}</Text>
          </div>

          {/* Card Background */}
          <div className="flex items-center gap-4">
            <Text>Card Background:</Text>
            <div
              className="w-12 h-12 border"
              style={{ backgroundColor: 'var(--card-bg)' }}
            />
            <Text>{settings.darkMode ? '#2A2A2A' : '#FFFFFF'}</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingAndProfile;