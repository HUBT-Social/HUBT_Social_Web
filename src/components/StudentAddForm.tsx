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

const StudentAddForm: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Form Values:', values);
    message.success('Thêm sinh viên thành công!');
    navigate('/dashboard/students');
  };

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Students</h2>

      <Tabs defaultActiveKey="1" className="mb-6">
        <Tabs.TabPane tab="Manually" key="1" />
        <Tabs.TabPane tab="Import CSV" key="2" />
      </Tabs>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sinh viên' }]}
          >
            <Input placeholder="Name" />
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
            label="Email address"
            name="email"
            rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item label="Phone number" name="phone">
            <Input placeholder="Phone number" />
          </Form.Item>
        </div>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <div className="flex items-center justify-between mt-6">
          <Form.Item name="addAnother" className="mb-0">
            <Radio.Group>
              <Radio value={true}>Add another</Radio>
            </Radio.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add student
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StudentAddForm;
