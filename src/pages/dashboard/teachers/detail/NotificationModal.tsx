import React from 'react';
import { Modal, Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface NotificationModalProps {
  visible: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  onImageUpload: (file: File) => boolean;
  onImageRemove: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onSubmit,
  onCancel,
  onImageUpload,
  onImageRemove,
}) => {
  const [form] = Form.useForm();

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
      title="Gửi thông báo"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
        >
          <Input placeholder="Nhập tiêu đề..." />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="body"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <TextArea rows={4} placeholder="Nhập nội dung..." />
        </Form.Item>

        <Form.Item label="Hình ảnh (nếu có)">
          <Upload
            beforeUpload={onImageUpload}
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
            onRemove={onImageRemove}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit">Gửi</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NotificationModal;