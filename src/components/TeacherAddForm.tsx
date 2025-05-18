import React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const TeacherAddForm: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const payload = {
      id: crypto.randomUUID(),
      userName: values.phone,
      email: values.email,
      avataUrl: '', // Có thể để rỗng hoặc mặc định
      phoneNumber: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      fcmToken: '',
      status: '',
      gender: values.gender === 'male' ? 1 : values.gender === 'female' ? 2 : 0,
      dateOfBirth: values.dateOfBirth?.toISOString() || '0001-01-01T00:00:00',
    };

    console.log('Mapped Payload:', payload);
    message.success('Thêm giáo viên thành công!');
    navigate('/dashboard/teachers');
  };

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Teacher</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
          >
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date of Birth" name="dateOfBirth">
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>
        </div>


        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <div className="flex justify-end mt-6">
          <Button type="primary" htmlType="submit">
            Add Teacher
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TeacherAddForm;
