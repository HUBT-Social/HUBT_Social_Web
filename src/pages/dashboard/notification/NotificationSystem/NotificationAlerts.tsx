
const NotificationAlerts = () => {


  return (
    <div className="fixed top-4 right-4 z-50">
      {/* <Alert
        message={notification.message}
        type={notification.type}
        showIcon
        icon={
          notification.type === 'success' ? <CheckCircleOutlined /> :
          notification.type === 'error' ? <ExclamationCircleOutlined /> :
          <InfoCircleOutlined />
        }
        className="max-w-sm shadow-lg border-0"
        closable
        onClose={() => setNotification(null)}
      /> */}
    </div>
  );
};

export default NotificationAlerts;