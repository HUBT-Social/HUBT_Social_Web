import React from 'react';
import { Card, Statistic } from 'antd';
import { TeamOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

interface StatsProps {
  total: number;
  selected: number;
  warningStudents: number;
  avgGPA: number;
  darkMode: boolean;
}

const StatisticsCards: React.FC<StatsProps> = ({ 
  total, 
  selected, 
  warningStudents, 
  avgGPA, 
  darkMode 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <Statistic
          title="Tổng số sinh viên"
          value={total}
          prefix={<TeamOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Card>
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <Statistic
          title="Đã chọn"
          value={selected}
          prefix={<UserOutlined />}
          valueStyle={{ color: '#52c41a' }}
        />
      </Card>
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <Statistic
          title="Cần cảnh báo"
          value={warningStudents}
          prefix={<BellOutlined />}
          valueStyle={{ color: '#ff4d4f' }}
        />
      </Card>
      <Card className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
        <Statistic
          title="Điểm TB trung bình"
          value={avgGPA}
          precision={1}
          valueStyle={{ color: '#faad14' }}
        />
      </Card>
    </div>
  );
};

export default StatisticsCards;