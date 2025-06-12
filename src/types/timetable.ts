export interface TimetableEntry {
  id: string;
  className: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  zoomID?: string;
  courseId: string;
  type: number;
  color?: string;
}

export interface TimetableData {
  versionKey: string;
  starttime: string;
  endtime: string;
  reformTimetables: TimetableEntry[];
}

export interface TimetableState {
  data: TimetableData;
  selectedEntry: TimetableEntry | null;
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  viewMode: 'week' | 'day' | 'month';
  selectedDate: string;
}

export interface CreateTimetableEntryRequest {
  className: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  zoomID?: string;
  courseId: string;
  type: number;
}

export interface UpdateTimetableEntryRequest extends CreateTimetableEntryRequest {
  id: string;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  entries: TimetableEntry[];
}

export interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}