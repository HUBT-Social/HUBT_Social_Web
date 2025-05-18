import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, addExam, updateExam, deleteExam, selectExams, selectExamsLoading, selectExamsError, clearError, Exam } from '../../../store/slices/examSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

interface ExamFormValues {
  title: string;
  description: string;
}

const ExamManagement: React.FC = () => {
  const dispatch = useDispatch();
  const exams = useSelector(selectExams);
  const isLoading = useSelector(selectExamsLoading);
  const error = useSelector(selectExamsError);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamFormValues & { id?: string } | null>(null);
  const [form] = Form.useForm();

  // Lấy danh sách bài kiểm tra khi component mount
  useEffect(() => {
    dispatch(fetchExams() as any);
  }, [dispatch]);

  // Xử lý lỗi và thông báo
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Mở modal để thêm bài kiểm tra
  const showAddModal = () => {
    setIsEditMode(false);
    setSelectedExam(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal để sửa bài kiểm tra
  const showEditModal = (exam: ExamFormValues & { id: string }) => {
    setIsEditMode(true);
    setSelectedExam(exam);
    form.setFieldsValue({
      title: exam.title,
      description: exam.description,
    });
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Xử lý submit form (thêm hoặc sửa)
  const handleSubmit = async (values: ExamFormValues) => {
    try {
      if (isEditMode && selectedExam?.id) {
        await dispatch(updateExam({ id: selectedExam.id, ...values }) as any).unwrap();
        message.success('Cập nhật bài kiểm tra thành công!');
      } else {
        await dispatch(addExam(values) as any).unwrap();
        message.success('Thêm bài kiểm tra thành công!');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Lỗi đã được xử lý trong examSlice và useEffect
    }
  };

  // Xử lý xóa bài kiểm tra
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài kiểm tra này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await dispatch(deleteExam(id) as any).unwrap();
          message.success('Xóa bài kiểm tra thành công!');
        } catch (error) {
          // Lỗi đã được xử lý trong examSlice và useEffect
        }
      },
    });
  };

  // Cột của bảng
  const columns = [
    {
      title: 'Tên bài kiểm tra',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Exam) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý bài kiểm tra</h1>
        <Button
          type="primary"
          size="large"
          className="bg-emerald-500 hover:bg-emerald-600"
          onClick={showAddModal}
        >
          Thêm bài kiểm tra
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spin tip="Đang tải..." />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={exams}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="shadow-lg rounded-lg"
        />
      )}

      {/* Modal thêm/sửa bài kiểm tra */}
      <Modal
        title={isEditMode ? 'Sửa bài kiểm tra' : 'Thêm bài kiểm tra'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Tên bài kiểm tra"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài kiểm tra!' }]}
          >
            <Input placeholder="Nhập tên bài kiểm tra" />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-rose-500 hover:bg-rose-600">
              {isEditMode ? 'Cập nhật' : 'Thêm'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamManagement;