import React, { FC, useState } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Input, 
  Space, 
  Empty, 
  message, 
  Typography,
  Breadcrumb,
  Statistic,
  Row,
  Col
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import PracticeTestForm from './PracticeTestForm';
import PracticeTestList from './PracticeTestList';
import PageContainer from './PageContainer';
import { PracticeTest, PracticeTestFormValues, TestType } from '../../../types/PracticeTestType';
import { mockPracticeTests } from './data/mockData';

const { Search } = Input;
const { Title } = Typography;

const PracticeTestManagement: FC = () => {
  const [tests, setTests] = useState<PracticeTest[]>(mockPracticeTests);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [editingTest, setEditingTest] = useState<PracticeTest | null>(null);

  const handleSubmit = async (values: PracticeTestFormValues) => {
    setLoading(true);
    try {
      if (editingTest) {
        const updatedTest: PracticeTest = {
          ...editingTest,
          ...values,
          updatedAt: new Date().toISOString(),
        };
        setTests(prev => prev.map(t => t.id === editingTest.id ? updatedTest : t));
        message.success('Cập nhật thành công!');
      } else {
        const newTest: PracticeTest = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTests(prev => [newTest, ...prev]);
        message.success('Thêm mới thành công!');
      }
      setModalVisible(false);
      setEditingTest(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test: PracticeTest) => {
    setEditingTest(test);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
    message.success('Xóa thành công!');
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Tải xuống thành công!');
  };

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchText.toLowerCase()) ||
    test.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const stats = {
    total: tests.length,
    active: tests.filter(t => new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    exams: tests.filter(t => t.type === TestType.Exam).length,
    practice: tests.filter(t => t.type === TestType.Practice).length,
  };

  return (
    <PageContainer
      header={{
        title: "Quản lý đề ôn tập",
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>Quản lý đề ôn tập</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <div className="mb-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Tổng số đề"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Đề mới (30 ngày)"
                value={stats.active}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Đề thi chính thức"
                value={stats.exams}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Statistic
                title="Đề ôn tập"
                value={stats.practice}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Search
              placeholder="Tìm kiếm đề ôn tập..."
              allowClear
              enterButton={<SearchOutlined />}
              className="w-full sm:w-80"
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingTest(null);
                setModalVisible(true);
              }}
              size="large"
              className="bg-primary hover:bg-blue-700"
            >
              Thêm đề mới
            </Button>
          </div>

          {filteredTests.length > 0 ? (
            <PracticeTestList
              tests={filteredTests}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ) : (
            <Empty 
              description="Chưa có đề ôn tập nào" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Space>
      </Card>

      <Modal
        title={
          <Title level={4}>
            {editingTest ? 'Chỉnh sửa đề ôn tập' : 'Thêm đề ôn tập mới'}
          </Title>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTest(null);
        }}
        footer={null}
        width={800}
        centered
        destroyOnClose
        className="rounded-lg"
      >
        <PracticeTestForm
          initialValues={editingTest as PracticeTestFormValues}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Modal>
    </PageContainer>
  );
};

export default PracticeTestManagement;