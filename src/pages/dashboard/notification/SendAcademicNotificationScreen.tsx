import React, { useState } from 'react';
import { Form, Input, Radio, Select, Button, Drawer, Typography, message } from 'antd';
import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface FormValues {
  title: string;
  notificationType: string;
  content?: string;
  recipientType: 'all' | 'specific';
  facultyCodes?: string[];
  courseCodes?: string[];
  classCodes?: string[];
  userNames?: string[];
}

const SendAcademicNotificationScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [recipientType, setRecipientType] = useState<'all' | 'specific'>('all');
  const [notificationType, setNotificationType] = useState<string>('general');
  const [facultyCodes, setFacultyCodes] = useState<string[]>([]);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [classCodes, setClassCodes] = useState<string[]>([]);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data (replace with API data in a real application)
  const faculties = ['CNTT', 'Điện', 'Cơ khí'];
  const availableCourses = ['Toán Cao Cấp', 'Vật Lý', 'Lập Trình'];
  const availableClasses = ['Lớp A1', 'Lớp A2', 'Lớp B1'];
  const availableUserNames = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];

  // Notification types
  const notificationTypes = [
    { label: 'Thông báo chung', value: 'general' },
    { label: 'Cảnh báo tình hình học tập', value: 'warning' },
    { label: 'Kết quả học tập', value: 'results' },
    { label: 'Thông báo chỉ định đối tượng', value: 'specific' },
  ];

  // Simulate filtered users based on selections (replace with actual logic)
  const filteredUsers = recipientType === 'all' 
    ? availableUserNames 
    : userNames.length > 0 
      ? userNames 
      : classCodes.length > 0 
        ? availableUserNames.slice(0, 2)
        : courseCodes.length > 0 
          ? availableUserNames.slice(0, 1)
          : facultyCodes.length > 0 
            ? availableUserNames 
            : [];

  // Handle form submission
  const onFinish = (values: FormValues) => {
    setIsLoading(true);
    // Simulate sending notification (replace with actual API call)
    console.log('Sending notification:', {
      title: values.title,
      notificationType: values.notificationType,
      content: values.content,
      recipientType: values.recipientType,
      recipients: values.recipientType === 'specific' ? { facultyCodes, courseCodes, classCodes, userNames } : 'all',
    });
    setTimeout(() => {
      message.success('Thông báo đã được gửi thành công!');
      form.resetFields();
      setRecipientType('all');
      setNotificationType('general');
      setFacultyCodes([]);
      setCourseCodes([]);
      setClassCodes([]);
      setUserNames([]);
      setIsLoading(false);
    }, 1000);
  };

  // Custom validator for specific recipients
  const validateRecipients = () => {
    if (recipientType === 'specific' && !facultyCodes.length && !courseCodes.length && !classCodes.length && !userNames.length) {
      return Promise.reject('Vui lòng chọn ít nhất một đối tượng nhận!');
    }
    return Promise.resolve();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
      {/* Help Button */}
      <Button
        type="text"
        icon={<QuestionCircleOutlined className="text-sky-600" />}
        onClick={() => setDrawerVisible(true)}
        className="absolute top-4 right-4"
      />

      {/* Send Notification Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-4"
      >
        <Title level={4} className="text-gray-800 mb-4">
          Gửi Thông báo Học tập
        </Title>

        <Form.Item
          name="title"
          label="Tiêu đề thông báo"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề thông báo!' }]}
        >
          <Input
            placeholder="Nhập tiêu đề thông báo"
            className="rounded-md"
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item
          name="notificationType"
          label="Loại thông báo"
          rules={[{ required: true, message: 'Vui lòng chọn loại thông báo!' }]}
        >
          <Select
            placeholder="Chọn loại thông báo"
            onChange={(value) => setNotificationType(value)}
            disabled={isLoading}
            className="w-full"
          >
            {notificationTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {notificationType === 'specific' && (
          <Form.Item
            name="content"
            label="Nội dung thông báo"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung thông báo!' }]}
          >
            <TextArea
              placeholder="Nhập nội dung thông báo (ví dụ: Bạn đã bị đuổi học)"
              rows={4}
              className="rounded-md"
              disabled={isLoading}
            />
          </Form.Item>
        )}

        {/* Recipients Section */}
        <Form.Item
          name="recipientType"
          label="Đối tượng nhận"
          rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận!' }, { validator: validateRecipients }]}
        >
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <UserOutlined className="mr-2" />
              Đối tượng nhận
            </h3>
            
            <div className="space-y-4">
              <Radio.Group
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                disabled={isLoading}
                className="flex space-x-4"
              >
                <Radio value="all">Gửi đến toàn trường</Radio>
                <Radio value="specific">Gửi đến đối tượng cụ thể</Radio>
              </Radio.Group>

              {recipientType === 'specific' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Ngành
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Chọn ngành"
                      value={facultyCodes}
                      onChange={setFacultyCodes}
                      options={faculties.map(f => ({ label: f, value: f }))}
                      disabled={isLoading}
                      className="w-full"
                      notFoundContent={<span>Không có lựa chọn</span>}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Môn học
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Chọn môn học"
                      value={courseCodes}
                      onChange={setCourseCodes}
                      options={availableCourses.map(c => ({ label: c, value: c }))}
                      disabled={isLoading}
                      className="w-full"
                      notFoundContent={<span>Không có lựa chọn</span>}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Lớp
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Chọn lớp"
                      value={classCodes}
                      onChange={setClassCodes}
                      options={availableClasses.map(c => ({ label: c, value: c }))}
                      disabled={isLoading}
                      className="w-full"
                      notFoundContent={<span>Không có lựa chọn</span>}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Người dùng
                    </label>
                    <Select
                      mode="multiple"
                      placeholder="Chọn người dùng"
                      value={userNames}
                      onChange={setUserNames}
                      options={availableUserNames.map(u => ({ label: u, value: u }))}
                      disabled={isLoading}
                      className="w-full"
                      notFoundContent={<span>Không có lựa chọn</span>}
                    />
                  </div>
                </div>
              )}

              {recipientType === 'specific' && (
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-sm text-blue-700">
                    <strong>{filteredUsers.length}</strong> người dùng sẽ nhận thông báo này
                  </p>
                  {filteredUsers.length === 0 && (
                    <p className="text-sm text-amber-600 mt-1">
                      Không có người dùng nào phù hợp với tiêu chí đã chọn
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-sky-600 hover:bg-sky-700"
            loading={isLoading}
          >
            Gửi thông báo
          </Button>
        </Form.Item>
      </Form>

      {/* Help Drawer */}
      <Drawer
        title="Hướng dẫn sử dụng"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={300}
      >
        <Title level={4}>Cách gửi thông báo học tập</Title>
        <Paragraph>
          1. <strong>Nhập tiêu đề</strong>: Điền tiêu đề ngắn gọn, rõ ràng (ví dụ: "Nhắc nhở nộp bài tập").
        </Paragraph>
        <Paragraph>
          2. <strong>Chọn loại thông báo</strong>: Chọn loại như "Thông báo chung", "Cảnh báo", "Kết quả học tập", hoặc "Chỉ định đối tượng".
        </Paragraph>
        <Paragraph>
          3. <strong>Nhập nội dung (nếu cần)</strong>: Nếu chọn "Thông báo chỉ định đối tượng", nhập nội dung chi tiết (ví dụ: "Bạn đã bị đuổi học").
        </Paragraph>
        <Paragraph>
          4. <strong>Chọn đối tượng</strong>: Chọn "Toàn trường" hoặc "Đối tượng cụ thể" (ngành, môn học, lớp, người dùng). Đảm bảo chọn ít nhất một đối tượng nếu là cụ thể.
        </Paragraph>
        <Paragraph>
          5. <strong>Kiểm tra số người nhận</strong>: Số lượng người dùng sẽ nhận thông báo được hiển thị.
        </Paragraph>
        <Paragraph>
          6. <strong>Gửi thông báo</strong>: Nhấn nút "Gửi thông báo" để hoàn tất.
        </Paragraph>
      </Drawer>
    </div>
  );
};

export default SendAcademicNotificationScreen;