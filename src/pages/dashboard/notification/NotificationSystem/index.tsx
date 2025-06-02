import { NotificationProvider } from '../contexts/NotificationContext';
import NotificationAlerts from './NotificationAlerts';
import NotificationHeader from './NotificationHeader';
import NotificationPreview from './NotificationPreview';
import NotificationTabs from './NotificationTabs';
import NotificationTemplateModal from './NotificationTemplateModal';

const NotificationSystem = () => {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <NotificationHeader />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <NotificationTabs />
        </div>
        <NotificationAlerts />
        <NotificationPreview />
        <NotificationTemplateModal />
      </div>
    </NotificationProvider>
  );
};

export default NotificationSystem;