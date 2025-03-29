import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface RegisterFormValues {
  teacherCode: string;
  teacherName: string;
  position: string;
  basicInfo: string;
  password: string;
  confirmPassword: string;
}

const positions = [
  { value: 'lecturer', label: 'Giảng viên' },
  { value: 'senior_lecturer', label: 'Giảng viên chính' },
  { value: 'professor', label: 'Giáo sư' },
];

const SignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = useCallback(async (values: RegisterFormValues) => {
    setLoading(true);
    console.log('Thông tin đăng ký:', values);

    // Giả lập gửi yêu cầu đăng ký (thay thế bằng API call thực tế)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setRegistrationSuccess(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/login'); // Chuyển về trang đăng nhập
  }, [navigate]);

  if (registrationSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <Typography.Title level={3} className="text-green-600 mb-4">
            Yêu cầu đăng ký đã được gửi!
          </Typography.Title>
          <Typography.Paragraph className="text-gray-600 mb-4">
            Vui lòng chờ quản trị viên phê duyệt tài khoản của bạn. Chúng tôi sẽ thông báo cho bạn qua email sau khi tài khoản được kích hoạt.
          </Typography.Paragraph>
          <Button type="primary" onClick={handleGoBack}>
            Quay lại trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <Typography.Title level={3} className="text-center mb-4 !text-gray-800">
          Đăng ký tài khoản giảng viên
        </Typography.Title>
        <Form
          name="register_form"
          onFinish={handleRegister}
          layout="vertical"
          disabled={loading}
          className="max-w-[400px] mx-auto" 
        >
          <Form.Item
            name="teacherCode"
            label="Mã giảng viên"
            rules={[{ required: true, message: 'Vui lòng nhập mã giảng viên!' }]}
          >
            <Input prefix={<IdcardOutlined className="text-gray-400" />} placeholder="Mã giảng viên" className="py-2" />
          </Form.Item>

          <Form.Item
            name="teacherName"
            label="Tên giảng viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên!' }]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Tên giảng viên" className="py-2" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
            rules={[{ required: true, message: 'Vui lòng chọn chức vụ!' }]}
          >
            <Select placeholder="Chọn chức vụ" options={positions} />
          </Form.Item>

          <Form.Item
            name="basicInfo"
            label="Thông tin cơ bản"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin cơ bản!' }]}
          >
            <Input.TextArea rows={3} placeholder="Thông tin cơ bản (ví dụ: khoa, bộ môn)" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Mật khẩu"
              className="py-2"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Xác nhận mật khẩu"
              className="py-2"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
            >
              Gửi yêu cầu đăng ký
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;