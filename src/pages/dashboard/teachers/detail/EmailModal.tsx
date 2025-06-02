import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const { TextArea } = Input;

interface EmailModalProps {
  visible: boolean;
  recipientEmail: string | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  visible,
  recipientEmail,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({ email: recipientEmail });
    }
  }, [visible, recipientEmail, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Gửi Email"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email người nhận"
          name="email"
          rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
        >
          <Input placeholder="abc@example.com" />
        </Form.Item>

        <Form.Item
          label="Tiêu đề"
          name="subject"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề..." />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung..." />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">Gửi</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EmailModal;