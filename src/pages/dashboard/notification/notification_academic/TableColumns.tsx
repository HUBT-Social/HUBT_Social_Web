import { UserOutlined } from '@ant-design/icons';
import { Badge, Progress, Space, Tag, Typography } from 'antd';
import { Recipient } from '../../../../types/Notification';

const { Text } = Typography;

export const columns = [
  {
    title: 'Tên sinh viên',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: Recipient) => (
      <Space>
        <UserOutlined />
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </div>
      </Space>
    ),
  },
  {
    title: 'Khoa',
    dataIndex: 'faculty',
    key: 'faculty',
    filters: [],  // This will be populated dynamically based on recipients
    onFilter: (value: any, record: Recipient) => record.faculty === value,
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: 'Lớp',
    dataIndex: 'class',
    key: 'class',
    render: (text: string) => <Tag color="purple">{text}</Tag>,
  },
  {
    title: 'Điểm TB',
    dataIndex: 'gpa',
    key: 'gpa',
    sorter: (a: Recipient, b: Recipient) => a.gpa - b.gpa,
    render: (gpa: number) => (
      <div>
        <Text strong style={{ color: gpa >= 7 ? '#52c41a' : gpa >= 5 ? '#faad14' : '#ff4d4f' }}>
          {gpa.toFixed(1)}
        </Text>
        <Progress 
          percent={gpa * 10} 
          size="small" 
          showInfo={false}
          strokeColor={gpa >= 7 ? '#52c41a' : gpa >= 5 ? '#faad14' : '#ff4d4f'}
        />
      </div>
    ),
  },
  {
    title: 'Vắng mặt',
    dataIndex: 'absences',
    key: 'absences',
    sorter: (a: Recipient, b: Recipient) => a.absences - b.absences,
    render: (absences: number) => (
      <Badge 
        count={absences} 
        style={{ backgroundColor: absences > 3 ? '#ff4d4f' : '#52c41a' }}
      />
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    filters: [],  // This will be populated dynamically based on recipients
    onFilter: (value: any, record: Recipient) => record.status === value,
    render: (status: string) => (
      <Tag color={status === 'Đang học' ? 'green' : 'red'}>
        {status}
      </Tag>
    ),
  },
];