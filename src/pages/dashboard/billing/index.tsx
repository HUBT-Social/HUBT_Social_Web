import React, { useState, useEffect, JSX } from 'react';
import type { FixedType } from 'rc-table/lib/interface';
import { 
  Layout, 
  Menu, 
  Button, 
  Table, 
  Card, 
  Statistic, 
  Tag, 
  Modal, 
  Input, 
  Select, 
  InputNumber,
  Space,
  Row,
  Col,
  Tabs,
  Avatar,
  Dropdown,
  notification,
  Progress,
  Badge,
  DatePicker,
  Divider,
  Form,
  Switch,
  Upload,
  List,
  Timeline,
  Descriptions,
  Alert,
  Empty
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  TeamOutlined,
  WalletOutlined,
  BarChartOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  CreditCardOutlined,
  PrinterOutlined,
  FilterOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  SafetyOutlined,
  GlobalOutlined,
  NotificationOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Mock data
const mockStudents = [
  {
    id: 1,
    studentId: 'SV001',
    name: 'Nguyễn Văn An',
    class: 'CNTT-K65',
    major: 'Công nghệ thông tin',
    phone: '0123456789',
    email: 'an.nv@email.com',
    totalFee: 15000000,
    paidAmount: 10000000,
    remainingAmount: 5000000,
    status: 'partial',
    semester: 'HK1-2024',
    enrollDate: '2023-09-01',
    dueDate: '2024-04-15'
  },
  {
    id: 2,
    studentId: 'SV002', 
    name: 'Trần Thị Bình',
    class: 'KT-K65',
    major: 'Kế toán',
    phone: '0987654321',
    email: 'binh.tt@email.com',
    totalFee: 12000000,
    paidAmount: 12000000,
    remainingAmount: 0,
    status: 'paid',
    semester: 'HK1-2024',
    enrollDate: '2023-09-01',
    dueDate: '2024-04-15'
  },
  {
    id: 3,
    studentId: 'SV003',
    name: 'Lê Văn Cường',
    class: 'CNTT-K64',
    major: 'Công nghệ thông tin',
    phone: '0456789123',
    email: 'cuong.lv@email.com',
    totalFee: 18000000,
    paidAmount: 0,
    remainingAmount: 18000000,
    status: 'unpaid',
    semester: 'HK1-2024',
    enrollDate: '2023-09-01',
    dueDate: '2024-04-15'
  },
  {
    id: 4,
    studentId: 'SV004',
    name: 'Phạm Thị Dung',
    class: 'QTKD-K65',
    major: 'Quản trị kinh doanh',
    phone: '0789123456',
    email: 'dung.pt@email.com',
    totalFee: 14000000,
    paidAmount: 7000000,
    remainingAmount: 7000000,
    status: 'partial',
    semester: 'HK1-2024',
    enrollDate: '2023-09-01',
    dueDate: '2024-04-15'
  }
];

const mockPayments = [
  {
    id: 1,
    studentId: 'SV001',
    studentName: 'Nguyễn Văn An',
    amount: 5000000,
    paymentDate: '2024-03-15',
    semester: 'Học kỳ 1 - 2024',
    method: 'Chuyển khoản',
    status: 'completed',
    receiptNumber: 'HD001',
    note: 'Thanh toán học phí đợt 1'
  },
  {
    id: 2,
    studentId: 'SV002',
    studentName: 'Trần Thị Bình',
    amount: 6000000,
    paymentDate: '2024-03-10',
    semester: 'Học kỳ 1 - 2024',
    method: 'Tiền mặt',
    status: 'completed',
    receiptNumber: 'HD002',
    note: 'Thanh toán đầy đủ học phí'
  },
  {
    id: 3,
    studentId: 'SV004',
    studentName: 'Phạm Thị Dung',
    amount: 7000000,
    paymentDate: '2024-03-20',
    semester: 'Học kỳ 1 - 2024',
    method: 'Chuyển khoản',
    status: 'completed',
    receiptNumber: 'HD003',
    note: 'Thanh toán học phí đợt 1'
  }
];

const mockNotifications = [
  {
    id: 1,
    type: 'warning',
    title: 'Sinh viên quá hạn thanh toán',
    message: 'Lê Văn Cường (SV003) đã quá hạn thanh toán 10 ngày',
    date: '2024-03-25',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Thanh toán thành công',
    message: 'Phạm Thị Dung đã thanh toán 7,000,000 VNĐ',
    date: '2024-03-20',
    read: true
  },
  {
    id: 3,
    type: 'success',
    title: 'Học kỳ mới',
    message: 'Đã cập nhật học phí cho học kỳ 2-2024',
    date: '2024-03-18',
    read: true
  }
];

const TuitionManagementSystem = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState(mockStudents);
  const [payments, setPayments] = useState(mockPayments);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({});

  // Statistics
  const totalStudents = students.length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidStudents = students.filter(s => s.status === 'paid').length;
  const unpaidStudents = students.filter(s => s.status === 'unpaid').length;
  const partialStudents = students.filter(s => s.status === 'partial').length;
  const overdueStudents = students.filter(s => 
    s.status !== 'paid' && new Date(s.dueDate) < new Date()
  ).length;

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: 'students', icon: <TeamOutlined />, label: 'Quản lý sinh viên' },
    { key: 'payments', icon: <DollarOutlined />, label: 'Thanh toán học phí' },
    { key: 'receipts', icon: <FileTextOutlined />, label: 'Hóa đơn & Biên lai' },
    { key: 'reports', icon: <BarChartOutlined />, label: 'Báo cáo thống kê' },
    { key: 'notifications', icon: <BellOutlined />, label: 'Thông báo & Nhắc nhở' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Cài đặt hệ thống' }
  ];

  const handleMenuClick = (e: { key: React.SetStateAction<string>; }) => {
    setActiveTab(e.key);
  };

  const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string; text: string; icon: JSX.Element }> = {
    paid: { color: 'green', text: 'Đã thanh toán', icon: <CheckCircleOutlined /> },
    unpaid: { color: 'red', text: 'Chưa thanh toán', icon: <ExclamationCircleOutlined /> },
    partial: { color: 'orange', text: 'Thanh toán một phần', icon: <ClockCircleOutlined /> }
  };

  const statusInfo = statusMap[status.toLowerCase()];

  if (!statusInfo) {
    return (
      <Tag color="default" icon={<QuestionCircleOutlined />}>
        Không xác định
      </Tag>
    );
  }

  return (
    <Tag color={statusInfo.color} icon={statusInfo.icon}>
      {statusInfo.text}
    </Tag>
  );
};

  const openModal = (type: React.SetStateAction<string>, record:any = null) => {
    setModalType(type);
    setSelectedStudent(record);
    setModalVisible(true);
    if (record && type === 'edit') {
      form.setFieldsValue(record);
    } else if (type === 'payment' && record) {
      form.setFieldsValue({
        studentName: record.name,
        studentId: record.studentId,
        remainingAmount: record.remainingAmount,
        semester: 'HK1-2024',
        method: 'Chuyển khoản'
      });
    } else {
      form.resetFields();
    }
  };

  const openViewModal = (record: React.SetStateAction<null>) => {
    setSelectedStudent(record);
    setViewModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (modalType === 'add') {
        const newStudent = {
          ...values,
          id: students.length + 1,
          studentId: `SV${String(students.length + 1).padStart(3, '0')}`,
          paidAmount: 0,
          remainingAmount: values.totalFee || 0,
          status: 'unpaid',
          semester: 'HK1-2024',
          enrollDate: new Date().toISOString().split('T')[0]
        };
        setStudents([...students, newStudent]);
        notification.success({ message: 'Thêm sinh viên thành công!' });
      } else if (modalType === 'edit') {
        const updatedStudents = students.map(student => 
          student.id === selectedStudent.id ? { ...student, ...values } : student
        );
        setStudents(updatedStudents);
        notification.success({ message: 'Cập nhật thông tin thành công!' });
      } else if (modalType === 'payment') {
        const paymentAmount = parseFloat(values.amount) || 0;
        const newPayment = {
          id: payments.length + 1,
          studentId: selectedStudent.studentId,
          studentName: selectedStudent.name,
          amount: paymentAmount,
          paymentDate: values.paymentDate || new Date().toISOString().split('T')[0],
          semester: values.semester || 'HK1-2024',
          method: values.method || 'Chuyển khoản',
          status: 'completed',
          receiptNumber: `HD${String(payments.length + 1).padStart(3, '0')}`,
          note: values.note || ''
        };
        setPayments([...payments, newPayment]);
        
        // Update student payment status
        const updatedStudents = students.map(student => {
          if (student.id === selectedStudent.id) {
            const newPaidAmount = student.paidAmount + paymentAmount;
            const newRemainingAmount = student.totalFee - newPaidAmount;
            return {
              ...student,
              paidAmount: newPaidAmount,
              remainingAmount: newRemainingAmount,
              status: newRemainingAmount === 0 ? 'paid' : 'partial'
            };
          }
          return student;
        });
        setStudents(updatedStudents);
        notification.success({ message: 'Thanh toán thành công!' });
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (record: { name: any; id: number; }) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa sinh viên ${record.name}?`,
      onOk: () => {
        const updatedStudents = students.filter(s => s.id !== record.id);
        setStudents(updatedStudents);
        notification.success({ message: 'Xóa sinh viên thành công!' });
      }
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const studentColumns = [
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 90,
      fixed: 'left' as FixedType,
      render: (text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: 'Thông tin sinh viên',
      key: 'studentInfo',
      width: 280,
      render: (_: any, record: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.name}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginLeft: 32 }}>
            <div><MailOutlined style={{ marginRight: 4 }} />{record.email}</div>
            <div><PhoneOutlined style={{ marginRight: 4 }} />{record.phone}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Lớp / Ngành',
      key: 'classInfo',
      width: 150,
      render: (_: any, record: { class: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; major: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.class}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.major}</div>
        </div>
      ),
    },
    {
      title: 'Học phí',
      key: 'feeInfo',
      width: 200,
      render: (_: any, record: { totalFee: { toLocaleString: (arg0: string) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; paidAmount: { toLocaleString: (arg0: string) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; remainingAmount: number; }) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Tổng: <span style={{ fontWeight: 'bold' }}>{record.totalFee.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div style={{ fontSize: '12px', color: '#52c41a' }}>
            Đã thanh toán: {record.paidAmount.toLocaleString('vi-VN')} VNĐ
          </div>
          <div style={{ fontSize: '12px', color: record.remainingAmount > 0 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
            Còn lại: {record.remainingAmount.toLocaleString('vi-VN')} VNĐ
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: string, record: { dueDate: string | number | Date; }) => (
        <div>
          {getStatusTag(status)}
          {status !== 'paid' && new Date(record.dueDate) < new Date() && (
            <div style={{ marginTop: 4 }}>
              <Tag color="red">Quá hạn</Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      fixed: 'right' as FixedType,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            title="Xem chi tiết"
            onClick={() => openViewModal(record)}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => openModal('edit', record)}
            title="Chỉnh sửa"
          />
          <Button 
            icon={<DollarOutlined />} 
            size="small" 
            type="primary" 
            onClick={() => openModal('payment', record)}
            disabled={record.status === 'paid'}
            title="Thanh toán"
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger 
            title="Xóa"
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'Mã biên lai',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 120,
      render: (text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{text}</span>
    },
    {
      title: 'Thông tin sinh viên',
      key: 'studentInfo',
      width: 200,
      render: (_: any, record: { studentName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; studentId: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.studentName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.studentId}</div>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: { toLocaleString: (arg0: string) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a', fontSize: '14px' }}>
          {amount.toLocaleString('vi-VN')} VNĐ
        </span>
      ),
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 130,
      render: (date: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </div>
      )
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
      width: 130,
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      width: 130,
      render: (method: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => {
        const icon = method === 'Chuyển khoản' ? <BankOutlined /> : 
                    method === 'Thẻ tín dụng' ? <CreditCardOutlined /> : <DollarOutlined />;
        return <Tag icon={icon}>{method}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: () => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Hoàn thành
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: () => (
        <Space size="small">
          <Button icon={<EyeOutlined />} size="small" title="Xem chi tiết" />
          <Button icon={<PrinterOutlined />} size="small" title="In biên lai" />
          <Button icon={<DownloadOutlined />} size="small" title="Tải xuống" />
        </Space>
      ),
    },
  ];

  const renderDashboard = () => (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng số sinh viên"
              value={totalStudents}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Đang theo học
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="VNĐ"
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Đã thu được
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Đã thanh toán"
              value={paidStudents}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Hoàn thành học phí
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="Quá hạn"
              value={overdueStudents}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
              Cần xử lý gấp
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="📊 Tình hình thanh toán" extra={<Button type="primary">Xem chi tiết</Button>}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />Đã thanh toán đầy đủ</span>
                <span style={{ fontWeight: 'bold' }}>{paidStudents}/{totalStudents}</span>
              </div>
              <Progress percent={Math.round((paidStudents / totalStudents) * 100)} status="success" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 4 }} />Thanh toán một phần</span>
                <span style={{ fontWeight: 'bold' }}>{partialStudents}/{totalStudents}</span>
              </div>
              <Progress percent={Math.round((partialStudents / totalStudents) * 100)} status="active" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span><ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />Chưa thanh toán</span>
                <span style={{ fontWeight: 'bold' }}>{unpaidStudents}/{totalStudents}</span>
              </div>
              <Progress percent={Math.round((unpaidStudents / totalStudents) * 100)} status="exception" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="🔔 Thông báo & Nhắc nhở" extra={<Button type="link">Xem tất cả</Button>}>
            <div style={{ marginBottom: 12 }}>
              <Badge status="processing" />
              <span style={{ marginLeft: 8 }}>5 sinh viên sắp đến hạn thanh toán</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Badge status="warning" />
              <span style={{ marginLeft: 8 }}>{overdueStudents} sinh viên quá hạn thanh toán</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Badge status="success" />
              <span style={{ marginLeft: 8 }}>{payments.length} thanh toán được xử lý</span>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ marginBottom: 8 }}>
              <Badge status="default" />
              <span style={{ marginLeft: 8 }}>Học kỳ mới sắp bắt đầu</span>
            </div>
            <div>
              <Badge status="default" />
              <span style={{ marginLeft: 8 }}>Cập nhật học phí học kỳ 2</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="📈 Thanh toán gần đây" extra={<Button type="primary">Xem tất cả</Button>}>
            <Table
              columns={paymentColumns.slice(0, 6)}
              dataSource={payments.slice(0, 5)}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderStudents = () => (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <h3 style={{ margin: 0 }}>👥 Danh sách sinh viên</h3>
            </Col>
            <Col xs={24} sm={12} md={16}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                <Search 
                  placeholder="Tìm kiếm theo tên, mã SV, lớp..." 
                  style={{ width: 250 }}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                  placeholder="Lọc trạng thái"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="paid">Đã thanh toán</Option>
                  <Option value="partial">Thanh toán một phần</Option>
                  <Option value="unpaid">Chưa thanh toán</Option>
                </Select>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('add')}>
                  Thêm sinh viên
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <Table
          columns={studentColumns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sinh viên`
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <h3 style={{ margin: 0 }}>💰 Quản lý thanh toán</h3>
            </Col>
            <Col xs={24} sm={12} md={16}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                <DatePicker.RangePicker placeholder={['Từ ngày', 'Đến ngày']}/>
                <Select placeholder="Phương thức" style={{ width: 120 }}>
                  <Option value="all">Tất cả</Option>
                  <Option value="cash">Tiền mặt</Option>
                  <Option value="transfer">Chuyển khoản</Option>
                  <Option value="card">Thẻ tín dụng</Option>
                </Select>
                <Button icon={<FilterOutlined />}>Lọc</Button>
              </div>
            </Col>
          </Row>
        </div>
        <Table
          columns={paymentColumns}
          dataSource={payments}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thanh toán`
          }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>Tổng cộng:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong style={{ color: '#52c41a' }}>
                  {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('vi-VN')} VNĐ
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} colSpan={5} />
            </Table.Summary.Row>
          )}
        />
      </Card>
    </div>
  );

  const renderReceipts = () => (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <h3 style={{ margin: 0 }}>🧾 Hóa đơn & Biên lai</h3>
            </Col>
            <Col xs={24} sm={12} md={16}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                <Search placeholder="Tìm kiếm mã biên lai..." style={{ width: 200 }} />
                <Button type="primary" icon={<PrinterOutlined />}>In hàng loạt</Button>
                <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
              </div>
            </Col>
          </Row>
        </div>
        
        <Tabs defaultActiveKey="receipts">
          <TabPane tab="Biên lai thanh toán" key="receipts">
            <Table
              columns={[
                ...paymentColumns.slice(0, -1),
                {
                  title: 'Thao tác',
                  key: 'action',
                  width: 150,
                  render: (_, record) => (
                    <Space size="small">
                      <Button icon={<EyeOutlined />} size="small" title="Xem biên lai" />
                      <Button icon={<PrinterOutlined />} size="small" type="primary" title="In biên lai" />
                      <Button icon={<DownloadOutlined />} size="small" title="Tải PDF" />
                    </Space>
                  ),
                }
              ]}
              dataSource={payments}
              rowKey="id"
              pagination={{ pageSize: 8 }}
            />
          </TabPane>
          <TabPane tab="Hóa đơn điện tử" key="invoices">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <div style={{ margin: '16px 0', color: '#666' }}>
                Tính năng hóa đơn điện tử đang được phát triển
              </div>
              <Button type="primary">Liên hệ hỗ trợ</Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="📊 Báo cáo tổng quan">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <TeamOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <span>Tổng sinh viên: <strong>{totalStudents}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <span>Tổng thu: <strong>{totalRevenue.toLocaleString('vi-VN')} VNĐ</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <span>Tỷ lệ hoàn thành: <strong>{Math.round((paidStudents/totalStudents)*100)}%</strong></span>
              </div>
            </div>
            <Button type="primary" block icon={<DownloadOutlined />}>Xuất báo cáo PDF</Button>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card title="📈 Biểu đồ thống kê" extra={
            <Select defaultValue="month\" style={{ width: 120 }}>
              <Option value="week">Tuần</Option>
              <Option value="month">Tháng</Option>
              <Option value="semester">Học kỳ</Option>
            </Select>
          }>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              <div style={{ textAlign: 'center' }}>
                <BarChartOutlined style={{ fontSize: '48px', marginBottom: 16 }} />
                <div>Biểu đồ thống kê sẽ được hiển thị tại đây</div>
                <div style={{ fontSize: '12px', marginTop: 8 }}>Sử dụng thư viện Chart.js hoặc Recharts</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="📋 Báo cáo chi tiết theo ngành/lớp">
            <Tabs defaultActiveKey="major">
              <TabPane tab="Theo ngành học" key="major">
                <Table
                  columns={[
                    { title: 'Ngành học', dataIndex: 'major', key: 'major' },
                    { title: 'Số sinh viên', dataIndex: 'count', key: 'count' },
                    { title: 'Đã thanh toán', dataIndex: 'paid', key: 'paid' },
                    { title: 'Tỷ lệ (%)', dataIndex: 'rate', key: 'rate', render: rate => `${rate}%` },
                    { title: 'Tổng thu (VNĐ)', dataIndex: 'revenue', key: 'revenue', render: amount => amount.toLocaleString('vi-VN') }
                  ]}
                  dataSource={[
                    { major: 'Công nghệ thông tin', count: 2, paid: 1, rate: 50, revenue: 10000000 },
                    { major: 'Kế toán', count: 1, paid: 1, rate: 100, revenue: 12000000 },
                    { major: 'Quản trị kinh doanh', count: 1, paid: 0, rate: 0, revenue: 7000000 }
                  ]}
                  rowKey="major"
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="Theo lớp học" key="class">
                <Table
                  columns={[
                    { title: 'Lớp', dataIndex: 'class', key: 'class' },
                    { title: 'Số sinh viên', dataIndex: 'count', key: 'count' },
                    { title: 'Đã thanh toán', dataIndex: 'paid', key: 'paid' },
                    { title: 'Tỷ lệ (%)', dataIndex: 'rate', key: 'rate', render: rate => `${rate}%` }
                  ]}
                  dataSource={[
                    { class: 'CNTT-K65', count: 1, paid: 0, rate: 0 },
                    { class: 'CNTT-K64', count: 1, paid: 0, rate: 0 },
                    { class: 'KT-K65', count: 1, paid: 1, rate: 100 },
                    { class: 'QTKD-K65', count: 1, paid: 0, rate: 0 }
                  ]}
                  rowKey="class"
                  pagination={false}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderNotifications = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="🔔 Thông báo hệ thống" extra={
            <Button type="primary" icon={<PlusOutlined />}>Tạo thông báo</Button>
          }>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="text" size="small">Đánh dấu đã đọc</Button>,
                    <Button type="text" size="small" danger>Xóa</Button>
                  ]}
                  style={{ 
                    backgroundColor: !item.read ? '#f6ffff' : 'transparent',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={!item.read}>
                        <Avatar 
                          style={{ 
                            backgroundColor: item.type === 'warning' ? '#faad14' : 
                                             item.type === 'success' ? '#52c41a' : '#1890ff' 
                          }}
                          icon={
                            item.type === 'warning' ? <ExclamationCircleOutlined /> :
                            item.type === 'success' ? <CheckCircleOutlined /> : <InfoCircleOutlined />
                          }
                        />
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: !item.read ? 'bold' : 'normal' }}>{item.title}</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>{item.date}</span>
                      </div>
                    }
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="⚙️ Cài đặt nhắc nhở">
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Nhắc nhở thanh toán:</div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Trước hạn 7 ngày
              </div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Trước hạn 3 ngày
              </div>
              <div style={{ marginBottom: 16 }}>
                <Switch defaultChecked /> Sau khi quá hạn
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Thông báo email:</div>
              <div style={{ marginBottom: 8 }}>
                <Switch /> Gửi cho sinh viên
              </div>
              <div style={{ marginBottom: 16 }}>
                <Switch /> Gửi cho phụ huynh
              </div>
            </div>
            
            <Button type="primary" block>Lưu cài đặt</Button>
          </Card>
          
          <Card title="📊 Thống kê nhanh" style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <Badge status="error" />
              <span style={{ marginLeft: 8 }}>{overdueStudents} sinh viên quá hạn</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Badge status="warning" />
              <span style={{ marginLeft: 8 }}>5 sinh viên sắp đến hạn</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <Badge status="processing" />
              <span style={{ marginLeft: 8 }}>{notifications.filter(n => !n.read).length} thông báo chưa đọc</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderSettings = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="🏫 Thông tin trường học">
            <Form layout="vertical">
              <Form.Item label="Tên trường">
                <Input defaultValue="Trường Đại học ABC" />
              </Form.Item>
              <Form.Item label="Địa chỉ">
                <TextArea rows={2} defaultValue="123 Đường XYZ, Quận 1, TP.HCM" />
              </Form.Item>
              <Form.Item label="Điện thoại">
                <Input defaultValue="(028) 1234 5678" />
              </Form.Item>
              <Form.Item label="Email">
                <Input defaultValue="info@university-abc.edu.vn" />
              </Form.Item>
              <Button type="primary">Cập nhật thông tin</Button>
            </Form>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="💰 Cài đặt học phí">
            <Form layout="vertical">
              <Form.Item label="Học phí mặc định">
                <InputNumber
                  style={{ width: '100%' }}
                  defaultValue={15000000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
              <Form.Item label="Phí phạt chậm nộp (%)">
                <InputNumber min={0} max={100} defaultValue={5} addonAfter="%" />
              </Form.Item>
              <Form.Item label="Thời hạn thanh toán (ngày)">
                <InputNumber min={1} defaultValue={30} addonAfter="ngày" />
              </Form.Item>
              <Button type="primary">Lưu cài đặt</Button>
            </Form>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="👥 Quản lý người dùng">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Quản trị viên</span>
                <Button size="small" type="primary">Thêm</Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Nhân viên kế toán</span>
                <Button size="small">Quản lý</Button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Nhân viên thu ngân</span>
                <Button size="small">Quản lý</Button>
              </div>
            </div>
            <Divider />
            <div>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Phân quyền:</div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Xem danh sách sinh viên
              </div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Xử lý thanh toán
              </div>
              <div style={{ marginBottom: 8 }}>
                <Switch /> Xóa dữ liệu
              </div>
              <div style={{ marginBottom: 16 }}>
                <Switch /> Cài đặt hệ thống
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="🔧 Cài đặt hệ thống">
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Sao lưu dữ liệu:</div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Tự động sao lưu hàng ngày
              </div>
              <div style={{ marginBottom: 16 }}>
                <Button icon={<DownloadOutlined />}>Sao lưu ngay</Button>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Bảo mật:</div>
              <div style={{ marginBottom: 8 }}>
                <Switch defaultChecked /> Đăng nhập 2 bước
              </div>
              <div style={{ marginBottom: 16 }}>
                <Switch defaultChecked /> Ghi log hoạt động
              </div>
            </div>
            
            <Alert
              message="Phiên bản hiện tại: v2.1.0"
              description="Có bản cập nhật mới v2.2.0 - Cập nhật để có thêm tính năng mới"
              type="info"
              showIcon
              action={<Button size="small" type="primary">Cập nhật</Button>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderStudentModal = () => (
    <Modal
      title={
        modalType === 'add' ? '➕ Thêm sinh viên mới' :
        modalType === 'edit' ? '✏️ Chỉnh sửa thông tin sinh viên' :
        '💰 Thanh toán học phí'
      }
      visible={modalVisible}
      onOk={handleModalOk}
      onCancel={() => {
        setModalVisible(false);
        form.resetFields();
      }}
      width={modalType === 'payment' ? 600 : 800}
      okText={modalType === 'payment' ? 'Xác nhận thanh toán' : 'Lưu'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {modalType === 'payment' ? (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Mã sinh viên" name="studentId">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên sinh viên" name="studentName">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Số tiền còn lại" name="remainingAmount">
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Số tiền thanh toán" 
                  name="amount"
                  rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    max={selectedStudent?.remainingAmount}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Học kỳ" name="semester">
                  <Select>
                    <Option value="HK1-2024">Học kỳ 1 - 2024</Option>
                    <Option value="HK2-2024">Học kỳ 2 - 2024</Option>
                    <Option value="HK3-2024">Học kỳ 3 - 2024</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phương thức thanh toán" name="method">
                  <Select>
                    <Option value="Tiền mặt">Tiền mặt</Option>
                    <Option value="Chuyển khoản">Chuyển khoản</Option>
                    <Option value="Thẻ tín dụng">Thẻ tín dụng</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Ghi chú" name="note">
              <TextArea rows={3} placeholder="Nhập ghi chú (tùy chọn)" />
            </Form.Item>
          </>
        ) : (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Họ và tên" 
                  name="name" 
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Lớp" 
                  name="class"
                  rules={[{ required: true, message: 'Vui lòng nhập lớp!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Ngành học" 
                  name="major"
                  rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
                >
                  <Select placeholder="Chọn ngành">
                    <Option value="Công nghệ thông tin">Công nghệ thông tin</Option>
                    <Option value="Kế toán">Kế toán</Option>
                    <Option value="Quản trị kinh doanh">Quản trị kinh doanh</Option>
                    <Option value="Luật">Luật</Option>
                    <Option value="Y khoa">Y khoa</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Số điện thoại" 
                  name="phone"
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Email" 
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Tổng học phí" 
                  name="totalFee"
                  rules={[{ required: true, message: 'Vui lòng nhập học phí!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    addonAfter="VNĐ"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Hạn thanh toán" name="dueDate">
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );

  const renderViewModal = () => {
    const studentPayments = payments.filter(p => p.studentId === selectedStudent?.studentId);
    
    return (
      <Modal
        title={`📋 Chi tiết sinh viên: ${selectedStudent?.name}`}
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close\" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="payment" 
            type="primary" 
            onClick={() => {
              setViewModalVisible(false);
              openModal('payment', selectedStudent);
            }}
            disabled={selectedStudent?.status === 'paid'}
          >
            Thanh toán
          </Button>,
          <Button key="edit" onClick={() => {
            setViewModalVisible(false);
            openModal('edit', selectedStudent);
          }}>
            Chỉnh sửa
          </Button>
        ]}
        width={800}
      >
        {selectedStudent && (
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Mã sinh viên">{selectedStudent.studentId}</Descriptions.Item>
              <Descriptions.Item label="Họ và tên">{selectedStudent.name}</Descriptions.Item>
              <Descriptions.Item label="Lớp">{selectedStudent.class}</Descriptions.Item>
              <Descriptions.Item label="Ngành học">{selectedStudent.major}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{selectedStudent.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
              <Descriptions.Item label="Ngày nhập học">{selectedStudent.enrollDate}</Descriptions.Item>
              <Descriptions.Item label="Hạn thanh toán">{selectedStudent.dueDate}</Descriptions.Item>
              <Descriptions.Item label="Tổng học phí">
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                  {selectedStudent.totalFee.toLocaleString('vi-VN')} VNĐ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Đã thanh toán">
                <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                  {selectedStudent.paidAmount.toLocaleString('vi-VN')} VNĐ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Còn lại">
                <span style={{ fontWeight: 'bold', color: selectedStudent.remainingAmount > 0 ? '#ff4d4f' : '#52c41a' }}>
                  {selectedStudent.remainingAmount.toLocaleString('vi-VN')} VNĐ
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {getStatusTag(selectedStudent.status)}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider>Lịch sử thanh toán</Divider>
            
            {studentPayments.length > 0 ? (
              <Timeline mode="left">
                {studentPayments.map(payment => (
                  <Timeline.Item 
                    key={payment.id}
                    color="green"
                    label={payment.paymentDate}
                  >
                    <Card size="small" style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                            {payment.amount.toLocaleString('vi-VN')} VNĐ
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            <Tag color="blue">{payment.method}</Tag>
                            <span style={{ marginLeft: 8 }}>Mã biên lai: {payment.receiptNumber}</span>
                          </div>
                          {payment.note && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                              Ghi chú: {payment.note}
                            </div>
                          )}
                        </div>
                        <Space>
                          <Button size="small" icon={<EyeOutlined />}>Xem biên lai</Button>
                          <Button size="small" icon={<PrinterOutlined />}>In</Button>
                        </Space>
                      </div>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có lịch sử thanh toán"
              />
            )}
          </div>
        )}
      </Modal>
    );
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'students':
        return renderStudents();
      case 'payments':
        return renderPayments();
      case 'receipts':
        return renderReceipts();
      case 'reports':
        return renderReports();
      case 'notifications':
        return renderNotifications();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Cài đặt tài khoản
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? 14 : 18,
          fontWeight: 'bold'
        }}>
          {collapsed ? '💰' : '💰 TMS'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeTab]}
          mode="inline"
          onClick={handleMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <span style={{ fontSize: '18px', marginLeft: 12 }}>
              {menuItems.find(item => item.key === activeTab)?.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={notifications.filter(n => !n.read).length} offset={[-2, 0]}>
              <Button icon={<BellOutlined />} shape="circle" />
            </Badge>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Button type="text" style={{ height: 64 }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <span>Admin</span>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
          {renderMainContent()}
        </Content>
        {renderStudentModal()}
        {renderViewModal()}
      </Layout>
    </Layout>
  );
};

export default TuitionManagementSystem;