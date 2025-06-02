import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface UpdatePasswordModalProps {
  visible: boolean;
  userName: string;
  form: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
  visible,
  userName,
  form,
  onSubmit,
  onCancel,
}) => {
  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({ userName });
    }
  }, [visible, userName, form]);

  return (
    <Modal
      title="Cập nhật mật khẩu"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item label="Tên đăng nhập" name="userName">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdatePasswordModal;