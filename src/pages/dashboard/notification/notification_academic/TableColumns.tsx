
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Progress, Space, Tag, Typography } from 'antd';
import {
  AcademicStatus,
  createFullName,
  getGPAColor,
  getStatusColor,
  Student,
} from '../../../../types/Student';

const { Text } = Typography;

/**
 * Renders the student information column.
 * @param record - The student record.
 * @returns JSX element for the student info column.
 */
const renderStudentInfo = (record: Student) => (
  <Space>
    <Avatar
      size={40}
      src={record.avataUrl}
      icon={<UserOutlined />}
      style={{ backgroundColor: '#1890ff' }}
    />
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{createFullName(record)}</div>
      <Space direction="vertical" size={2}>
        {/* <Text type="secondary" style={{ fontSize: '12px' }}>
          <UserOutlined style={{ marginRight: 4 }} />
          {record.userName}
        </Text> */}
        {/* {record.email && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {record.email}
          </Text>
        )}
        {record.phoneNumber && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {record.phoneNumber}
          </Text>
        )} */}
      </Space>
    </div>
  </Space>
);

/**
 * Renders the GPA column with progress bar and badge.
 * @param gpa - The GPA value (10-point scale).
 * @returns JSX element for the GPA column.
 */
const renderGPA = (diemTB10: number) => (
  <div style={{ minWidth: 80 }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
      <Text strong style={{ color: getGPAColor(diemTB10), marginRight: 8 }}>
        {diemTB10}
      </Text>
      <Badge
        count={diemTB10 >= 8 ? '⭐' : diemTB10 >= 7 ? '👍' : diemTB10 >= 5 ? '⚠️' : '❌'}
        style={{ backgroundColor: 'transparent' }}
      />
    </div>
    <Progress
      percent={Math.min(diemTB10 * 10, 100)}
      size="small"
      showInfo={false}
      strokeColor={getGPAColor(diemTB10)}
      style={{ margin: 0 }}
    />
  </div>
);

/**
 * Renders the academic status column.
 * @param status - The academic status of the student.
 * @returns JSX element for the academic status column.
 */
const renderAcademicStatus = (status: AcademicStatus | undefined) => (
  <Tag color={status ? getStatusColor(status) : 'default'} style={{ margin: 0 }}>
    {status || 'Unspecified'}
  </Tag>
);



/**
 * Type guard to check if a value is a valid AcademicStatus.
 * @param value - The value to check.
 * @returns True if the value is a valid AcademicStatus.
 */
const isAcademicStatus = (value: string | number | boolean | bigint): value is AcademicStatus =>
  typeof value === 'string' &&
  ['Excellent', 'VeryGood', 'Good', 'FairlyGood', 'Average', 'Weak', 'Warning'].includes(
    value
  );


/**
 * Column configuration for the student table.
 */
export const columns = [
  {
    title: 'Student Information',
    dataIndex: 'userName',
    key: 'userName',
    width: 280,
    fixed: 'left' as const,
    render: (_: string, record: Student) => renderStudentInfo(record),
  },
  {
    title: 'Faculty',
    dataIndex: 'faculty',
    key: 'faculty',
    width: 150,
    filters: [], // Populated dynamically in EnhancedNotificationSystem
    onFilter: (value: string | number | boolean | bigint, record: Student) =>
      typeof value === 'string' && record.faculty === value,
    render: (text: string) => <Tag color="blue">{text}</Tag>,
  },
  {
    title: 'Class',
    dataIndex: 'className',
    key: 'className',
    width: 120,
    render: (text: string | null) => (
      <Tag color="purple">{text || 'Unspecified'}</Tag>
    ),
  },
  {
    title: 'Course',
    dataIndex: 'course',
    key: 'course',
    width: 100,
    render: (text: string) => <Tag color="geekblue">{text}</Tag>,
  },
  {
    title: 'GPA',
    dataIndex: 'diemTB10',
    key: 'diemTB10',
    width: 120,
    sorter: (a: Student, b: Student) => a.diemTB10 - b.diemTB10,
    render: (diemTB10: number) => renderGPA(diemTB10),
  },
  {
    title: 'Academic Status',
    dataIndex: 'academicStatus',
    key: 'academicStatus',
    width: 160,
    filters: [
      { text: 'Excellent', value: 'Excellent' },
      { text: 'Very Good', value: 'VeryGood' },
      { text: 'Good', value: 'Good' },
      { text: 'Fairly Good', value: 'FairlyGood' },
      { text: 'Average', value: 'Average' },
      { text: 'Weak', value: 'Weak' },
      { text: 'Warning', value: 'Warning' }
    ],
    onFilter: (value: string | number | boolean | bigint, record: Student) =>
      isAcademicStatus(value) && record.academicStatus === value,
    render: (status: AcademicStatus | undefined) => renderAcademicStatus(status),
  },
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   key: 'status',
  //   width: 120,
  //   filters: Object.keys(statusConfig).map(status => ({
  //     text: status,
  //     value: status,
  //   })),
  //   onFilter: (value: string | number | boolean | bigint, record: Student) =>
  //     isStudentStatus(value) && record.status === value,
  //   render: (status: StudentStatus) => renderStatus(status),
  // },
  // {
  //   title: 'Gender',
  //   dataIndex: 'gender',
  //   key: 'gender',
  //   width: 100,
  //   render: (gender: Gender) => (
  //     <Text style={{ fontSize: '12px' }}>{getGenderLabel(gender)}</Text>
  //   ),
  // }
];

/**
 * Compact column configuration for minimal views.
 */
export const compactColumns = columns.filter(col =>
  ['userName', 'faculty', 'className', 'gpa10', 'academicStatus', 'status'].includes(col.key)
);

/**
 * Detailed column configuration (includes all columns).
 */
export const detailedColumns = [...columns];

/**
 * Returns column configuration based on notification type.
 * @param type - The notification type.
 * @returns Array of columns tailored for the notification type.
 */
export const getColumnsForNotificationType = (type: string) => {
  switch (type) {
    case 'academic':
      return columns.filter(col =>
        ['userName', 'faculty', 'className', 'gpa10', 'academicStatus'].includes(col.key)
      );
    case 'attendance':
      return columns.filter(col =>
        ['userName', 'faculty', 'className', 'status'].includes(col.key)
      );
    case 'warning':
      return columns.filter(col =>
        ['userName', 'faculty', 'gpa10', 'academicStatus', 'status'].includes(col.key)
      );
    default:
      return compactColumns;
  }
};