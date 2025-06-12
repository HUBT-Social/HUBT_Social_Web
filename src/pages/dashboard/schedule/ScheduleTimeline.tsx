import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  PlusOutlined,
  SettingOutlined,
  TableOutlined
} from '@ant-design/icons';
import { Button, Card, Col, FloatButton, Layout, Menu, message, Row, Statistic, Tabs } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTimetable, setViewMode, TimetableEntry } from '../../../store/slices/scheduleSlice';
import { AppDispatch, RootState } from '../../../store/store';
import CalendarView from './CalendarView';
import TimetableTimeline from './ScheduleComponent';
import { exportToCalendar } from './unit';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

const TimetableApp: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [activeView, setActiveView] = useState('timeline');
  const [selectedClass, ] = useState<string>('ql27.12'); // Default class
  
  // Redux hooks
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error } = useSelector((state: RootState) => state.schedule);

  // Fetch timetable data when class changes
  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchTimetable({ className: selectedClass }));
    }
  }, [selectedClass, dispatch]);

  // Display error messages
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch({ type: 'schedule/clearError' });
    }
  }, [error, dispatch]);

  // Handle menu click
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'settings' || key === 'notifications') {
      message.info(`Chức năng ${key === 'settings' ? 'cài đặt' : 'thông báo'} đang được phát triển`);
      return;
    }
    setActiveView(key);
    dispatch(setViewMode(key === 'timeline' ? 'week' : 'month'));
  };

  // Handle export to calendar
  const handleExport = () => {
    if (!data?.data?.length) {
      message.error('Không có dữ liệu để xuất');
      return;
    }
    const icsContent = exportToCalendar(data.data, 'ics');
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable_${selectedClass}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
    message.success('Đã xuất thời khóa biểu sang lịch');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout className="min-h-screen" style={{backgroundColor: 'white'}}>
        {/* Sidebar */}
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed} 
          width={200} 
          className="shadow-sm "
          style={{backgroundColor: 'white'}}
        >
          <div className="h-16 flex items-center justify-center">
            <h2 className="text-lg font-bold text-gray-800">{collapsed ? 'TKB' : 'Thời Khóa Biểu'}</h2>
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['timeline']}
            onClick={handleMenuClick}
            className="border-r-0"
            items={[
              {
                key: 'timeline',
                icon: <TableOutlined />,
                label: 'Dạng timeline',
              },
              {
                key: 'calendar',
                icon: <CalendarOutlined />,
                label: 'Dạng lịch',
              },
              {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Cài đặt',
              },
              {
                key: 'notifications',
                icon: <BellOutlined />,
                label: 'Thông báo',
              },
            ]}
          />
        </Sider>

        {/* Main content */}
        <Layout>
          {/* Header */}
          <Header className="shadow-sm px-6 py-4 flex justify-between items-center bg-white" style={{backgroundColor: 'white'}}>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Thời Khóa Biểu</h1>
            <div className="flex items-center gap-4">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                Xuất lịch
              </Button>
            </div>
          </Header>

          {/* Content */}
          <Content className="m-6 bg-gray-50">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Statistic
                    title="Tổng số tiết học"
                    value={data?.data?.length || 0}
                    prefix={<BookOutlined className="text-blue-600" />}
                    className="text-center"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Statistic
                    title="Số lớp tuần này"
                    value={data?.data?.filter((entry: TimetableEntry) => 
                      dayjs(entry.startTime).isSame(dayjs(), 'week')
                    ).length || 0}
                    prefix={<CalendarOutlined className="text-green-600" />}
                    className="text-center"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Statistic
                    title="Phòng học"
                    value={[...new Set(data?.data?.map((entry: TimetableEntry) => entry.room))].length || 0}
                    prefix={<EnvironmentOutlined className="text-orange-600" />}
                    className="text-center"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Statistic
                    title="Thời gian học"
                    value={data?.data?.reduce((total: number, entry: TimetableEntry) => 
                      total + dayjs(entry.endTime).diff(dayjs(entry.startTime), 'hour', true), 0).toFixed(1) || 0}
                    suffix="giờ"
                    prefix={<ClockCircleOutlined className="text-purple-600" />}
                    className="text-center"
                  />
                </Card>
              </Col>
            </Row>

            <Tabs 
              activeKey={activeView} 
              onChange={setActiveView}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <TabPane tab="Timeline" key="timeline">
                <TimetableTimeline />
              </TabPane>
              <TabPane tab="Lịch" key="calendar">
                <CalendarView />
              </TabPane>
            </Tabs>
          </Content>

          {/* Float button for adding new entry */}
          <FloatButton
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => message.info('Chức năng thêm lịch mới được xử lý trong Timeline hoặc Calendar component')}
            tooltip="Thêm lịch mới"
            className="bg-blue-600 hover:bg-blue-700"
          />
        </Layout>
      </Layout>
    </DndProvider>
  );
};

export default TimetableApp;