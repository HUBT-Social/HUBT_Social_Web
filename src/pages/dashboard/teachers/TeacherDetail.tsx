import React, { useState } from 'react';
import { Button, Card, Avatar, Tag, Space, Modal, Form, Input, Select, Tabs, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';

const { Option } = Select;

const TeacherDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Dữ liệu giáo viên
  const [teacher, setTeacher] = useState({
    id: '1',
    name: 'John Nguyen',
    avatarUrl: 'https://st.nhipcaudautu.vn/staticFile/Subject/2022/02/25/space-x-elon-musk_251529404.jpeg',
    email: 'john.nguyen@university.edu',
    phone: '0901234567',
    gender: 'Male',
    roles: ['Lecturer', 'Curriculum Advisor'],
    subjects: ['Mathematics', 'Statistics'],
    description:
      'Nulla Lorem mollit cupidatat irure. Laborum magna nulla duis ullamco cillum dolor. Voluptate exercitation incididunt aliquip deserunt elit laborum.',
    age: 34,
  });

  // Danh sách tùy chọn cho roles và subjects
  const roleOptions = ['Lecturer', 'Curriculum Advisor', 'Researcher', 'Dean'];
  const subjectOptions = ['Mathematics', 'Statistics', 'Physics', 'Chemistry'];

  // Hiển thị modal chỉnh sửa
  const showEditModal = () => {
    form.setFieldsValue(teacher); // Điền trước dữ liệu vào form
    setIsModalVisible(true);
  };

  // Xử lý submit form
  const onFinish = (values: any) => {
    console.log('Updated teacher:', values);
    setTeacher({ ...teacher, ...values }); // Cập nhật state (thay bằng API nếu có)
    message.success('Cập nhật giáo viên thành công!');
    setIsModalVisible(false);
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <Card className="w-full mt-4 sm:mt-6 shadow-lg rounded-lg">
        <div className="flex flex-col md:flex-row md:space-x-8 p-4 sm:p-6">
          {/* Avatar và thông tin cơ bản */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar
              size={150}
              src={teacher.avatarUrl}
              icon={<UserOutlined />}
              className="border-2 border-blue-500 mb-4"
            />
            <h2 className="text-2xl font-semibold text-gray-800">{teacher.name}</h2>
            <Space wrap className="mb-4">
              {teacher.roles.map((role, index) => (
                <Tag key={index} color="blue" className="text-sm">
                  {role}
                </Tag>
              ))}
            </Space>
            {/* Icon liên hệ */}
            <Space size="large" className="mb-4">
              <UserOutlined className="text-xl text-blue-500" />
              <PhoneOutlined className="text-xl text-blue-500" />
              <MailOutlined className="text-xl text-blue-500" />
            </Space>
          </div>
          {/* Thông tin chi tiết */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
            <p className="text-gray-600 mb-6">{teacher.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div>
                <span className="font-medium text-gray-600">ID:</span>
                <p>{teacher.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p>{teacher.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Phone:</span>
                <p>{teacher.phone}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Subjects:</span>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <Tag key={index} color="green" className="text-sm">
                      {subject}
                    </Tag>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Age:</span>
                <p>{teacher.age}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Gender:</span>
                <p>{teacher.gender}</p>
              </div>
            </div>
            {/* Nút hành động */}
            <Space size="middle" className="flex justify-end">
              <Button
                onClick={() => navigate('/dashboard/teachers')}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Quay lại
              </Button>
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={showEditModal}
              >
                Edit
              </Button>
              <Button
                danger
                onClick={() => {
                  console.log('Delete teacher:', id);
                }}
              >
                Delete
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Edit Teacher"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <div className="p-8 bg-white">
          <Tabs defaultActiveKey="1" className="mb-6">
            <Tabs.TabPane tab="Manually" key="1" />
            <Tabs.TabPane tab="Import CSV" key="2" disabled />
          </Tabs>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên' }]}
              >
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item
                label="Roles"
                name="roles"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select mode="multiple" placeholder="Select roles">
                  {roleOptions.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Email address"
                name="email"
                rules={[
                  { type: 'email', message: 'Email không hợp lệ' },
                  { required: true, message: 'Vui lòng nhập email' },
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>

              <Form.Item label="Phone number" name="phone">
                <Input placeholder="Phone number" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Subjects"
                name="subjects"
                rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
              >
                <Select mode="multiple" placeholder="Select subjects">
                  {subjectOptions.map((subject) => (
                    <Option key={subject} value={subject}>
                      {subject}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
              >
                <Input type="number" placeholder="Age" />
              </Form.Item>
            </div>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} placeholder="Description" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <div className="flex items-center justify-between mt-6">
              <Button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherDetail;