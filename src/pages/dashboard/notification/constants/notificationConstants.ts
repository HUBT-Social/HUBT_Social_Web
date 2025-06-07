export const notificationTypes = [
  { 
    value: 'warning', 
    label: 'Cảnh báo học tập', 
    defaultContent: 'Sinh viên cần cải thiện điểm số để đạt yêu cầu tốt nghiệp.',
    icon: '⚠️',
    color: 'orange'
  },
  { 
    value: 'event', 
    label: 'Sự kiện', 
    defaultContent: 'Thông báo về sự kiện quan trọng sắp diễn ra tại trường.',
    icon: '📅',
    color: 'blue'
  },
  { 
    value: 'deadline', 
    label: 'Hạn chót', 
    defaultContent: 'Sắp đến hạn nộp bài/tài liệu quan trọng.',
    icon: '⏰',
    color: 'red'
  },
  { 
    value: 'achievement', 
    label: 'Thành tích', 
    defaultContent: 'Chúc mừng bạn đã đạt thành tích học tập xuất sắc!',
    icon: '🏆',
    color: 'green'
  },
  { 
    value: 'reminder', 
    label: 'Nhắc nhở', 
    defaultContent: 'Đừng quên kiểm tra lịch học và cập nhật thông tin cá nhân.',
    icon: '🔔',
    color: 'purple'
  }
]

export const priorities = [
  { value: 'low', label: 'Thấp', color: 'green', percentage: 25 },
  { value: 'medium', label: 'Trung bình', color: 'orange', percentage: 60 },
  { value: 'high', label: 'Cao', color: 'red', percentage: 90 },
];

export const channelOptions = [
  { value: 'Push', label: 'Push Notification', icon: '🔔' },
  { value: 'Email', label: 'Email', icon: '📧' },
  { value: 'SMS', label: 'SMS', icon: '💬' }
];