import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { UserInfo } from '../../../../types/user';

const { Option } = Select;

interface EditTeacherModalProps {
  visible: boolean;
  teacher: UserInfo | null;
  form: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  visible,
  teacher,
  form,
  onSubmit,
  onCancel,
}) => {
  React.useEffect(() => {
    if (visible && teacher) {
      form.setFieldsValue({
        id: teacher.id,
        userName: teacher.userName,
        email: teacher.email,
        avataUrl: teacher.avataUrl,
        phoneNumber: teacher.phoneNumber,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        fcmToken: teacher.fcmToken,
        status: teacher.status,
        gender: teacher.gender === 1 ? 'Male' : teacher.gender === 0 ? 'Female' : 'Other',
        dateOfBirth: teacher.dateOfBirth ? dayjs(teacher.dateOfBirth) : undefined,
      });
    }
  }, [visible, teacher, form]);

  return (
    <Modal
      title="Chỉnh sửa thông tin giáo viên"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="ID" name="id">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tên đăng nhập" name="userName">
              <Input />
            </Form.Item>
            <Form.Item 
              label="Tên" 
              name="firstName" 
              rules={[{ required: true, message: 'Vui lòng nhập tên giáo viên' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              label="Họ" 
              name="lastName" 
              rules={[{ required: true, message: 'Vui lòng nhập họ giáo viên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item 
              label="Giới tính" 
              name="gender" 
              rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            >
              <Select>
                <Option value="Male">Nam</Option>
                <Option value="Female">Nữ</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item 
              label="Email" 
              name="email" 
              rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label="Ngày sinh" name="dateOfBirth">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditTeacherModal;