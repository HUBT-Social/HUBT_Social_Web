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
    value: 'tuition', 
    label: 'Học phí', 
    defaultContent: 'Nhắc nhở về thời hạn nộp học phí học kỳ.',
    icon: '💰',
    color: 'green'
  },
  { 
    value: 'attendance', 
    label: 'Điểm danh', 
    defaultContent: 'Cảnh báo về tình trạng nghỉ học vượt quá quy định.',
    icon: '📋',
    color: 'red'
  },
  { 
    value: 'emergency', 
    label: 'Khẩn cấp', 
    defaultContent: 'Thông báo khẩn cấp từ ban giám hiệu trường.',
    icon: '🚨',
    color: 'volcano'
  },
];

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