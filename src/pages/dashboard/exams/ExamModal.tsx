import React from 'react';
import { Modal } from 'antd';
import ExamForm from './ExamForm';

interface ExamModalProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
}

const ExamModal: React.FC<ExamModalProps> = ({ visible, onCancel, onFinish, initialValues}) => {
  return (
    <Modal
      title={initialValues ? 'Sửa đề' : 'Thêm đề mới'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <ExamForm onFinish={onFinish} initialValues={initialValues} />
    </Modal>
  );
};

export default ExamModal;