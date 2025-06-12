import {
  BookOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
  Upload
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addExam,
  deleteExam,
  fetchExams,
  selectExamsLoading,
  selectFilteredExams,
  selectPagination,
  setExams,
  setFilter,
  setPagination,
  updateExam
} from '../../../store/slices/examSlice';
import { AppDispatch } from '../../../store/store';
import { Exam } from '../../../types/exams';

const { Search } = Input;
const { TextArea } = Input;
const { Title, Text } = Typography;

const ExamList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const exams = useSelector(selectFilteredExams);
  const loading = useSelector(selectExamsLoading);
  const pagination = useSelector(selectPagination);
  const [searchTerm, ] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMajor, setFilterMajor] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const majorOptions = [
    { label: '📊 Toán học', value: 'Toán', color: '#1890ff' },
    { label: '⚛️ Vật lý', value: 'Lý', color: '#52c41a' },
    { label: '🧪 Hóa học', value: 'Hóa', color: '#fa8c16' },
    { label: '📚 Văn học', value: 'Văn', color: '#eb2f96' },
    { label: '🌍 Địa lý', value: 'Địa', color: '#13c2c2' },
  ];

  const statusConfig = {
    draft: { color: '#faad14', text: 'Nháp' },
    pending: { color: '#1890ff', text: 'Đang xử lý' },
    approved: { color: '#52c41a', text: 'Đã duyệt' },
  };

//   useEffect(() => {
//     dispatch(fetchExams({ page: pagination.current, pageSize: pagination.pageSize, major: filterMajor }));
//   }, [dispatch, pagination.current, pagination.pageSize, filterMajor]);

  // const handleTableChange = (pagination: any) => {
  //   dispatch(setPagination({ current: pagination.current, pageSize: pagination.pageSize }));
  // };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = !searchTerm || 
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns: ColumnsType<Exam> = [
    { 
      title: (
        <Space>
          <FileTextOutlined />
          Tiêu đề
        </Space>
      ), 
      dataIndex: 'title', 
      key: 'title', 
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text: string) => (
        <Text strong className="text-gray-800">{text}</Text>
      )
    },
    { 
      title: 'Mô tả', 
      dataIndex: 'description', 
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text type="secondary">{text}</Text>
        </Tooltip>
      )
    },
    { 
      title: (
        <Space>
          <BookOutlined />
          Môn học
        </Space>
      ), 
      dataIndex: 'major', 
      key: 'major', 
      sorter: (a, b) => a.major.localeCompare(b.major),
      render: (major: string) => {
        const majorOption = majorOptions.find(opt => opt.value === major);
        return (
          <Badge 
            color={majorOption?.color || '#666'} 
            text={majorOption?.label || major}
          />
        );
      }
    },
    { 
      title: 'Tệp tin', 
      dataIndex: 'fileName', 
      key: 'fileName',
      render: (fileName: string) => (
        <Space>
          <FileTextOutlined className="text-blue-500" />
          <Text code>{fileName}</Text>
        </Space>
      )
    },
    { 
      title: (
        <Space>
          <CalendarOutlined />
          Ngày tạo
        </Space>
      ), 
      dataIndex: 'createdDate', 
      key: 'createdDate', 
      sorter: (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      render: (date: string) => (
        <Text type="secondary">
          {formatDate(date)}
        </Text>
      )
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status', 
      filters: [
        { text: 'Nháp', value: 'draft' },
        { text: 'Đang xử lý', value: 'pending' },
        { text: 'Đã duyệt', value: 'approved' },
      ], 
      onFilter: (value: any, record) => record.status === value,
      render: (status: string) => (
        <Badge 
          color={statusConfig[status as keyof typeof statusConfig]?.color}
          text={statusConfig[status as keyof typeof statusConfig]?.text}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="primary" 
              ghost
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              danger
              ghost
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id!)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Tải xuống">
            <Button 
              type="default"
              ghost
              icon={<DownloadOutlined />}
              size="small"
              className="text-green-600 border-green-600 hover:text-green-700 hover:border-green-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam);
    setIsModalVisible(true);
    form.setFieldsValue({
      title: exam.title,
      description: exam.description,
      major: exam.major,
      status: exam.status,
    });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa đề thi này? Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      icon: <DeleteOutlined className="text-red-500" />,
      onOk: () => {
        dispatch(deleteExam(id)).unwrap().then(() => {
          message.success('Đề thi đã được xóa thành công');
        }).catch((error) => {
          message.error(error || 'Đã xảy ra lỗi khi xóa đề thi');
        });
      },
    });
  };

  const handleAddOrUpdate = (values: any) => {
    setFormLoading(true);
    const formData = new FormData();
    formData.append('Title', values.title);
    formData.append('Description', values.description);
    formData.append('Major', values.major);
    if (values.status) formData.append('status', values.status);
    if (values.file) formData.append('File', values.file.file.originFileObj);

    if (editingExam) {
      dispatch(updateExam({ 
        id: editingExam.id!, 
        title: values.title, 
        description: values.description, 
        status: values.status, 
        major: values.major 
      }))
        .unwrap()
        .then(() => {
          message.success('Đề thi đã được cập nhật thành công');
          setIsModalVisible(false);
          setEditingExam(null);
          form.resetFields();
        })
        .catch((error) => {
          message.error(error || 'Đã xảy ra lỗi khi cập nhật đề thi');
        })
        .finally(() => setFormLoading(false));
    } else {
      dispatch(addExam({
        title: values.title,
        description: values.description,
        major: values.major,
        file: values.file?.file.originFileObj,
      }))
        .unwrap()
        .then(() => {
          message.success('Đề thi đã được thêm thành công');
          setIsModalVisible(false);
          form.resetFields();
        })
        .catch((error) => {
          message.error(error || 'Đã xảy ra lỗi khi thêm đề thi');
        })
        .finally(() => setFormLoading(false));
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    dispatch(setFilter({ status: value, searchTerm, major: filterMajor }));
  };

  const handleMajorFilterChange = (value: string) => {
    setFilterMajor(value);
    dispatch(fetchExams({ page: pagination.current, pageSize: pagination.pageSize, major: value }));
    dispatch(setFilter({ major: value, searchTerm, status: filterStatus }));
  };

  const handleResetExams = () => {
    const fakeExams: Exam[] = [
  {
    id: "1",
    title: "Đề thi Giải tích 1 - Kỳ thi cuối kỳ",
    description: "Đề thi cuối kỳ môn Giải tích 1 dành cho sinh viên năm nhất khối ngành Kỹ thuật",
    fileName: "calculus_1_final_exam.pdf",
    major: "Toán",
    createdDate: "2025-06-01T10:00:00Z",
    status: "approved",
  },
  {
    id: "2",
    title: "Đề thi Vật lý Đại cương A1",
    description: "Đề thi giữa kỳ môn Vật lý Đại cương A1 cho sinh viên khối ngành Kỹ thuật",
    fileName: "general_physics_midterm.pdf",
    major: "Lý",
    createdDate: "2025-06-02T14:30:00Z",
    status: "pending",
  },
  {
    id: "3",
    title: "Đề thi Hóa học Đại cương",
    description: "Đề thi cuối kỳ môn Hóa học Đại cương dành cho sinh viên khoa Hóa học",
    fileName: "general_chemistry_final.pdf",
    major: "Hóa",
    createdDate: "2025-06-03T09:15:00Z",
    status: "approved",
  },
  {
    id: "4",
    title: "Đề thi Ngữ văn Đại cương",
    description: "Đề thi cuối kỳ môn Ngữ văn Đại cương - Môn học cơ sở chung",
    fileName: "literature_general_final.pdf",
    major: "Văn",
    createdDate: "2025-06-04T16:45:00Z",
    status: "draft",
  },
  {
    id: "5",
    title: "Đề thi Địa lý Kinh tế",
    description: "Đề thi giữa kỳ môn Địa lý Kinh tế dành cho sinh viên khoa Địa lý",
    fileName: "economic_geography_midterm.pdf",
    major: "Địa",
    createdDate: "2025-06-05T11:20:00Z",
    status: "pending",
  },
  {
    id: "6",
    title: "Đề thi Xác suất Thống kê",
    description: "Đề thi cuối kỳ môn Xác suất Thống kê cho sinh viên khối ngành Kinh tế",
    fileName: "probability_statistics_final.pdf",
    major: "Toán",
    createdDate: "2025-06-06T13:00:00Z",
    status: "approved",
  },
  {
    id: "7",
    title: "Đề thi Cơ học Lý thuyết",
    description: "Đề thi cuối kỳ môn Cơ học Lý thuyết dành cho sinh viên ngành Vật lý",
    fileName: "theoretical_mechanics_final.pdf",
    major: "Lý",
    createdDate: "2025-06-07T08:30:00Z",
    status: "draft",
  },
  {
    id: "8",
    title: "Đề thi Hóa học Phân tích",
    description: "Đề thi giữa kỳ môn Hóa học Phân tích cho sinh viên năm thứ hai khoa Hóa",
    fileName: "analytical_chemistry_midterm.pdf",
    major: "Hóa",
    createdDate: "2025-06-08T15:10:00Z",
    status: "pending",
  },
  {
    id: "9",
    title: "Đề thi Văn học Việt Nam Hiện đại",
    description: "Đề thi cuối kỳ môn Văn học Việt Nam Hiện đại - Khoa Ngữ văn",
    fileName: "modern_vietnamese_literature_final.pdf",
    major: "Văn",
    createdDate: "2025-06-09T12:45:00Z",
    status: "approved",
  },
  {
    id: "10",
    title: "Đề thi Địa lý Tự nhiên Việt Nam",
    description: "Đề thi cuối kỳ môn Địa lý Tự nhiên Việt Nam cho sinh viên chuyên ngành Địa lý",
    fileName: "vietnam_physical_geography_final.pdf",
    major: "Địa",
    createdDate: "2025-06-10T10:15:00Z",
    status: "draft",
  },
  {
    id: "11",
    title: "Đề thi Đại số Tuyến tính",
    description: "Đề thi giữa kỳ môn Đại số Tuyến tính dành cho sinh viên khối ngành Toán - Tin",
    fileName: "linear_algebra_midterm.pdf",
    major: "Toán",
    createdDate: "2025-06-11T14:20:00Z",
    status: "pending",
  },
  {
    id: "12",
    title: "Đề thi Nhiệt động học",
    description: "Đề thi cuối kỳ môn Nhiệt động học cho sinh viên ngành Kỹ thuật Cơ khí",
    fileName: "thermodynamics_final.pdf",
    major: "Lý",
    createdDate: "2025-06-12T09:00:00Z",
    status: "approved",
  },
  {
    id: "13",
    title: "Đề thi Hóa học Hữu cơ",
    description: "Đề thi giữa kỳ môn Hóa học Hữu cơ dành cho sinh viên năm thứ ba khoa Hóa",
    fileName: "organic_chemistry_midterm.pdf",
    major: "Hóa",
    createdDate: "2025-06-13T16:30:00Z",
    status: "draft",
  },
  {
    id: "14",
    title: "Đề thi Lý thuyết Văn học",
    description: "Đề thi cuối kỳ môn Lý thuyết Văn học - Môn cơ sở ngành Ngữ văn",
    fileName: "literary_theory_final.pdf",
    major: "Văn",
    createdDate: "2025-06-14T11:45:00Z",
    status: "pending",
  },
  {
    id: "15",
    title: "Đề thi Khí tượng học",
    description: "Đề thi cuối kỳ môn Khí tượng học cho sinh viên chuyên ngành Địa lý Tự nhiên",
    fileName: "meteorology_final.pdf",
    major: "Địa",
    createdDate: "2025-06-15T13:25:00Z",
    status: "approved",
  }
];
    dispatch(setExams(fakeExams));
    message.success('Danh sách đề thi đã được đặt lại với dữ liệu mẫu.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <Title level={2} className="mb-2 text-gray-800">
                <FileTextOutlined className="mr-3" />
                Quản lý Đề thi
              </Title>
              <Text type="secondary" className="text-base">
                Quản lý và tổ chức các đề thi, bài kiểm tra một cách hiệu quả
              </Text>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => { 
                  setIsModalVisible(true); 
                  setEditingExam(null); 
                  form.resetFields(); 
                }}
                size="large"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Thêm đề mới
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleResetExams}
                size="large"
              >
                Dữ liệu mẫu
              </Button>
            </Space>
          </div>
        </Card>

        {/* Filter Section */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <div className="space-y-2">
                <Text strong className="text-gray-700">
                  <SearchOutlined className="mr-2" />
                  Tìm kiếm
                </Text>
                <Search
                  placeholder="Tìm kiếm theo tiêu đề, mô tả, môn học..."
                  onSearch={(value) => dispatch(setFilter({ searchTerm: value }))}
                  onChange={(e) => dispatch(setFilter({ searchTerm: e.target.value }))}
                  size="large"
                  allowClear
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="space-y-2">
                <Text strong className="text-gray-700">
                  <FilterOutlined className="mr-2" />
                  Trạng thái
                </Text>
                <Select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  style={{ width: '100%' }}
                  placeholder="Lọc theo trạng thái"
                  size="large"
                >
                  <Select.Option value="all">Tất cả trạng thái</Select.Option>
                  <Select.Option value="draft">
                    <Badge color="#faad14" text="Nháp" />
                  </Select.Option>
                  <Select.Option value="pending">
                    <Badge color="#1890ff" text="Đang xử lý" />
                  </Select.Option>
                  <Select.Option value="approved">
                    <Badge color="#52c41a" text="Đã duyệt" />
                  </Select.Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <div className="space-y-2">
                <Text strong className="text-gray-700">
                  <BookOutlined className="mr-2" />
                  Môn học
                </Text>
                <Select
                  value={filterMajor}
                  onChange={handleMajorFilterChange}
                  style={{ width: '100%' }}
                  placeholder="Lọc theo môn học"
                  size="large"
                  allowClear
                >
                  {majorOptions.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredExams}
            loading={loading}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) => dispatch(setPagination({ current: page, pageSize })),
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} đề thi`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
            className="custom-table"
            rowClassName={(_record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        </Card>

        {/* Modal Section */}
        <Modal
          title={
            <Space>
              {editingExam ? <EditOutlined /> : <PlusOutlined />}
              {editingExam ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}
            </Space>
          }
          open={isModalVisible}
          onCancel={() => { 
            setIsModalVisible(false); 
            setEditingExam(null); 
            form.resetFields(); 
          }}
          footer={null}
          width={700}
          className="custom-modal"
        >
          <Divider />
          <Spin spinning={formLoading}>
            <Form
              form={form}
              onFinish={handleAddOrUpdate}
              layout="vertical"
              initialValues={editingExam || {}}
              className="space-y-4"
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item 
                    name="title" 
                    label={<Text strong>Tiêu đề đề thi</Text>}
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                  >
                    <Input size="large" placeholder="Nhập tiêu đề đề thi..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item 
                    name="description" 
                    label={<Text strong>Mô tả</Text>}
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                  >
                    <TextArea 
                      rows={4} 
                      size="large" 
                      placeholder="Nhập mô tả chi tiết về đề thi..."
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="major" 
                    label={<Text strong>Môn học</Text>}
                    rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
                  >
                    <Select size="large" placeholder="Chọn môn học">
                      {majorOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item 
                    name="status" 
                    label={<Text strong>Trạng thái</Text>}
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                  >
                    <Select size="large" placeholder="Chọn trạng thái">
                      <Select.Option value="draft">
                        <Badge color="#faad14" text="Nháp" />
                      </Select.Option>
                      <Select.Option value="pending">
                        <Badge color="#1890ff" text="Đang xử lý" />
                      </Select.Option>
                      <Select.Option value="approved">
                        <Badge color="#52c41a" text="Đã duyệt" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item 
                    name="file" 
                    label={<Text strong>Tệp đề thi</Text>}
                    rules={[{ required: !editingExam, message: 'Vui lòng chọn tệp!' }]}
                  >
                    <Upload.Dragger
                      name="file"
                      multiple={false}
                      beforeUpload={() => false}
                      onChange={(info) => {
                        form.setFieldsValue({ file: info.fileList[0] });
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                      </p>
                      <p className="ant-upload-text">
                        Nhấp hoặc kéo tệp vào khu vực này để tải lên
                      </p>
                      <p className="ant-upload-hint">
                        Hỗ trợ định dạng: PDF, DOC, DOCX (Tối đa 10MB)
                      </p>
                    </Upload.Dragger>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Row justify="end">
                <Space>
                  <Button 
                    size="large"
                    onClick={() => { 
                      setIsModalVisible(false); 
                      form.resetFields(); 
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    loading={formLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingExam ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                </Space>
              </Row>
            </Form>
          </Spin>
        </Modal>
      </div>

    </div>
  );
};

export default ExamList;