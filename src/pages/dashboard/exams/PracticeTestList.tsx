import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, Tag } from 'antd';
import { FC } from 'react';
import { PracticeTest, TestType } from '../../../types/PracticeTestType';


interface PracticeTestListProps {
  tests: PracticeTest[];
  onEdit: (test: PracticeTest) => void;
  onDelete: (id: string) => void;
  onDownload: (fileUrl: string, fileName: string) => void;
}

const PracticeTestList: FC<PracticeTestListProps> = ({ tests, onEdit, onDelete, onDownload }) => {
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: TestType) => (
        <Tag color={type === TestType.Practice ? 'blue' : 'green'}>
          {type === TestType.Practice ? 'Ôn tập' : 'Thi chính thức'}
        </Tag>
      ),
    },
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: PracticeTest) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            size="small"
            danger
          >
            Xóa
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => onDownload(record.fileUrl, record.fileName)}
            size="small"
            className="text-green-600 border-green-600 hover:bg-green-50"
          >
            Tải xuống
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={tests}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      className="shadow-sm"
    />
  );
};

export default PracticeTestList;