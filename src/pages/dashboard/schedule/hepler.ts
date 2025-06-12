import { TimetableData, TimetableEntry } from "../../../store/slices/scheduleSlice";


export const generateContentNotification = (
  data: TimetableData | null,
  currentTimeTableId: string,
  newTimeTable: TimetableEntry
): string => {
  // Find the current timetable entry
  const currentTimeTable = data?.data.find(e => e.id === currentTimeTableId);

  // Handle case where timetable is not found
  if (!currentTimeTable) {
    return `Bạn có thay đổi nhỏ với lịch học, vui lòng kiểm tra.`;
  }

  const changes: string[] = [];

  // Collect changes
  if (currentTimeTable.startTime !== newTimeTable.startTime) {
    changes.push(`thời gian bắt đầu từ ${currentTimeTable.startTime} thành ${newTimeTable.startTime}`);
  }
  if (currentTimeTable.endTime !== newTimeTable.endTime) {
    changes.push(`thời gian kết thúc từ ${currentTimeTable.endTime} thành ${newTimeTable.endTime}`);
  }
  if (currentTimeTable.room !== newTimeTable.room) {
    changes.push(`phòng học từ ${currentTimeTable.room} thành ${newTimeTable.room}`);
  }
  if (currentTimeTable.zoomID !== newTimeTable.zoomID) {
    changes.push(`Zoom ID từ ${currentTimeTable.zoomID} thành ${newTimeTable.zoomID}`);
  }

  // Generate notification based on number of changes
  if (changes.length === 0) {
    return `Lớp ${currentTimeTable.className} (Môn: ${currentTimeTable.subject}) không có thay đổi trong lịch học.`;
  }

  const classInfo = `Lớp ${currentTimeTable.className} (Môn: ${currentTimeTable.subject})`;
  let changeText: string;

  if (changes.length === 1) {
    changeText = `đã thay đổi ${changes[0]}.`;
  } else if (changes.length === 2) {
    changeText = `đã thay đổi ${changes.join(' và ')}.`;
  } else {
    const lastChange = changes.pop()!;
    changeText = `đã thay đổi ${changes.join(', ')} và ${lastChange}.`;
  }

  return `Thông báo: ${classInfo} ${changeText}`;
}