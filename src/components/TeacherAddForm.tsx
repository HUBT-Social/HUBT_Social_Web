import React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Radio,
  Tabs,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const TeacherAddForm: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Form Values:', values);
    message.success('Thêm giáo viên thành công!');
    navigate('/dashboard/teachers');
  };

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Add Teachers</h2>
        <Form.Item name="designation" className="mb-0">
          <Input placeholder="Designation" className="w-64" />
        </Form.Item>
      </div>

      <Tabs defaultActiveKey="1" className="mb-6">
        <Tabs.TabPane tab="Manually" key="1" />
        <Tabs.TabPane tab="Import CSV" key="2" />
      </Tabs>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên' }]}
        >
          <Input placeholder="Full Name" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label="Email address"
            name="email"
            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item label="Class" name="class">
            <Select placeholder="Select class">
              <Option value="1">Class 1</Option>
              <Option value="2">Class 2</Option>
              <Option value="3">Class 3</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item label="Phone number" name="phone">
            <Input placeholder="Phone number" />
          </Form.Item>
        </div>

        <Form.Item label="Subject" name="subject">
          <Select placeholder="Select subject">
            <Option value="math">Math</Option>
            <Option value="science">Science</Option>
            <Option value="history">History</Option>
          </Select>
        </Form.Item>

        <div className="flex items-center justify-between mt-6">
          <Form.Item name="addAnother" className="mb-0">
            <Radio.Group>
              <Radio value={true}>Add another</Radio>
            </Radio.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add Teacher
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TeacherAddForm;
