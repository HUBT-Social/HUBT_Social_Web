import { DashboardOutlined, HistoryOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useNotificationContext } from '../contexts/NotificationContext';
import ComposeTab from './Compose/ComposeTab';
import DashboardTab from './Dashboard/DashboardTab';
import HistoryTab from './History/HistoryTab';
import SettingsTab from './Settings/SettingsTab';



const { TabPane } = Tabs;

const NotificationTabs = () => {
  const { activeTab, setActiveTab } = useNotificationContext();

  return (
    <Tabs 
      activeKey={activeTab} 
      onChange={setActiveTab}
      size="large"
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <TabPane
        tab={
          <span className="flex items-center space-x-2">
            <DashboardOutlined />
            <span>Dashboard</span>
          </span>
        }
        key="dashboard"
      >
        <DashboardTab />
      </TabPane>
      
      <TabPane
        tab={
          <span className="flex items-center space-x-2">
            <SendOutlined />
            <span>Compose</span>
          </span>
        }
        key="compose"
      >
        <ComposeTab />
      </TabPane>
      
      <TabPane
        tab={
          <span className="flex items-center space-x-2">
            <HistoryOutlined />
            <span>History</span>
          </span>
        }
        key="history"
      >
        <HistoryTab />
      </TabPane>

      <TabPane
        tab={
          <span className="flex items-center space-x-2">
            <SettingOutlined />
            <span>Settings</span>
          </span>
        }
        key="settings"
      >
        <SettingsTab />
      </TabPane>
    </Tabs>
  );
};

export default NotificationTabs;