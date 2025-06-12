import dayjs from 'dayjs';
import { DaySchedule, TimeSlot, TimetableEntry } from '../../../types/timetable';

// Color palette for different subjects
export const SUBJECT_COLORS = [
  '#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1',
  '#13c2c2', '#f5222d', '#fadb14', '#a0d911', '#096dd9'
];

// Generate color for subject based on hash
export const getSubjectColor = (subject: string): string => {
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
};

// Group entries by date
export const groupEntriesByDate = (entries: TimetableEntry[]): DaySchedule[] => {
  const grouped = entries.reduce((acc, entry) => {
    const date = dayjs(entry.startTime).format('YYYY-MM-DD');
    if (!acc[date]) {
      acc[date] = {
        date,
        dayName: dayjs(entry.startTime).format('dddd'),
        entries: []
      };
    }
    acc[date].entries.push(entry);
    return acc;
  }, {} as Record<string, DaySchedule>);

  return Object.values(grouped).sort((a, b) => 
    dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
  );
};

// Generate time slots for timeline
export const generateTimeSlots = (startHour = 7, endHour = 22): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push({
      hour,
      minute: 0,
      label: `${hour.toString().padStart(2, '0')}:00`
    });
  }
  return slots;
};

// Check if two time periods overlap
export const isTimeOverlap = (
  start1: string, end1: string,
  start2: string, end2: string
): boolean => {
  const s1 = dayjs(start1);
  const e1 = dayjs(end1);
  const s2 = dayjs(start2);
  const e2 = dayjs(end2);

  return s1.isBefore(e2) && s2.isBefore(e1);
};

// Get entries for specific date and time range
export const getEntriesForTimeSlot = (
  entries: TimetableEntry[],
  date: dayjs.Dayjs,
  hour: number
): TimetableEntry[] => {
  return entries.filter(entry => {
    const entryStart = dayjs(entry.startTime);
    const entryEnd = dayjs(entry.endTime);
    
    if (!entryStart.isSame(date, 'day')) return false;
    
    const slotStart = date.hour(hour).minute(0).second(0);
    const slotEnd = slotStart.add(1, 'hour');
    
    return entryStart.isBefore(slotEnd) && entryEnd.isAfter(slotStart);
  });
};

// Calculate entry position and height for timeline
export const calculateEntryPosition = (entry: TimetableEntry, baseHour = 7) => {
  const startTime = dayjs(entry.startTime);
  const endTime = dayjs(entry.endTime);
  
  const startHour = startTime.hour();
  const startMinute = startTime.minute();
  const duration = endTime.diff(startTime, 'minute');
  
  const top = ((startHour - baseHour) * 60) + (startMinute);
  const height = Math.max(duration, 30);
  
  return { top, height };
};

// Format duration in human readable format
export const formatDuration = (startTime: string, endTime: string): string => {
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const duration = end.diff(start, 'minute');
  
  if (duration < 60) {
    return `${duration} phút`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
};

// Generate unique ID for new entries
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validate timetable entry
export const validateTimetableEntry = (entry: Partial<TimetableEntry>): string[] => {
  const errors: string[] = [];
  
  if (!entry.subject?.trim()) {
    errors.push('Tên môn học không được để trống');
  }
  
  if (!entry.className?.trim()) {
    errors.push('Lớp học không được để trống');
  }
  
  if (!entry.room?.trim()) {
    errors.push('Phòng học không được để trống');
  }
  
  if (!entry.startTime) {
    errors.push('Thời gian bắt đầu không được để trống');
  }
  
  if (!entry.endTime) {
    errors.push('Thời gian kết thúc không được để trống');
  }
  
  if (entry.startTime && entry.endTime) {
    const start = dayjs(entry.startTime);
    const end = dayjs(entry.endTime);
    
    if (end.isBefore(start) || end.isSame(start)) {
      errors.push('Thời gian kết thúc phải sau thời gian bắt đầu');
    }
    
    const duration = end.diff(start, 'minute');
    if (duration > 480) {
      errors.push('Thời lượng không được vượt quá 8 tiếng');
    }
  }
  
  return errors;
};

// Export calendar data
export const exportToCalendar = (entries: TimetableEntry[], format: 'ics' | 'csv' = 'ics'): string => {
  if (format === 'csv') {
    const headers = ['Subject', 'Class', 'Start Time', 'End Time', 'Room', 'Zoom ID'];
    const rows = entries.map(entry => [
      entry.subject,
      entry.className,
      dayjs(entry.startTime).format('YYYY-MM-DD HH:mm'),
      dayjs(entry.endTime).format('YYYY-MM-DD HH:mm'),
      entry.room,
      entry.zoomID || ''
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Timetable App//EN'
  ];
  
  entries.forEach(entry => {
    const start = dayjs(entry.startTime);
    const end = dayjs(entry.endTime);
    
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${entry.id}@timetable.app`,
      `DTSTART:${start.format('YYYYMMDD[T]HHmmss')}`,
      `DTEND:${end.format('YYYYMMDD[T]HHmmss')}`,
      `SUMMARY:${entry.subject} (${entry.className})`,
      `LOCATION:${entry.room}`,
      `DESCRIPTION:Lớp: ${entry.className}\\nPhòng: ${entry.room}${entry.zoomID ? `\\nZoom: ${entry.zoomID}` : ''}`,
      'END:VEVENT'
    );
  });
  
  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

// Filter entries by various criteria
export const filterEntries = (
  entries: TimetableEntry[],
  filters: {
    subject?: string;
    className?: string;
    room?: string;
    dateRange?: [string, string];
  }
): TimetableEntry[] => {
  return entries.filter(entry => {
    if (filters.subject && !entry.subject.toLowerCase().includes(filters.subject.toLowerCase())) {
      return false;
    }
    
    if (filters.className && !entry.className.toLowerCase().includes(filters.className.toLowerCase())) {
      return false;
    }
    
    if (filters.room && !entry.room.toLowerCase().includes(filters.room.toLowerCase())) {
      return false;
    }
    
    if (filters.dateRange) {
      const entryDate = dayjs(entry.startTime);
      const [startDate, endDate] = filters.dateRange;
      if (entryDate.isBefore(startDate) || entryDate.isAfter(endDate)) {
        return false;
      }
    }
    
    return true;
  });
};