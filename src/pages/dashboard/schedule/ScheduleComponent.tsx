import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined, DragOutlined, EditOutlined, EnvironmentOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Spin, Tag, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import 'dayjs/locale/vi';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTimetableEntry,
  CreateTimetableEntryRequest,
  deleteTimetableEntry,
  fetchTimetable,
  setEditMode,
  TimetableEntry,
  updateTimetableEntry,
  UpdateTimetableEntryRequest
} from '../../../store/slices/scheduleSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { validateTimetableEntry } from './unit';
import { sendEventTimeTable } from '../../../store/slices/notificationSlice';
import { generateContentNotification } from './hepler';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.locale('vi'); // Use Vietnamese day names


interface DraggableEntryProps {
  entry: TimetableEntry;
  onEdit: (entry: TimetableEntry) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
}

const DraggableEntry: React.FC<DraggableEntryProps> = ({ entry, onEdit, onDelete, isEditing }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'timetable-entry',
    item: { id: entry.id, entry },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditing,
  }));

  drag(ref);

  // Parse UTC time without converting to Vietnam timezone
  const startTime = dayjs.utc(entry.startTime);
  const endTime = dayjs.utc(entry.endTime);
  const duration = endTime.diff(startTime, 'hour', true);

  return (
    <div
      ref={ref}
      className={`relative bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 p-3 mb-2 ${
        isDragging ? 'opacity-50 cursor-move' : 'cursor-pointer'
      } ${isEditing ? 'hover:bg-gray-50' : ''}`}
      style={{ borderLeftColor: '#1890ff', minHeight: `${Math.max(duration * 60, 80)}px` }}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="opacity-60 hover:opacity-100"
          />
          <Popconfirm
            title="Xóa lịch trình?"
            description="Bạn có chắc chắn muốn xóa lịch trình này?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(entry.id);
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              className="opacity-60 hover:opacity-100 hover:text-red-500"
            />
          </Popconfirm>
        </div>
      )}
      <div className="pr-16">
        <div className="flex items-center gap-2 mb-2">
          <Tag color="blue" className="text-xs font-medium">{entry.className}</Tag>
          {isEditing && <DragOutlined className="text-gray-400 text-xs" />}
        </div>
        <h4 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{entry.subject}</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <ClockCircleOutlined />
            <span>{startTime.format('HH:mm')} - {endTime.format('HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1">
            <EnvironmentOutlined />
            <span>{entry.room}</span>
          </div>
          {entry.zoomID && (
            <div className="flex items-center gap-1">
              <Tag color="green" className="text-xs">Zoom: {entry.zoomID}</Tag>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TimeSlotProps {
  hour: number;
  day: Dayjs;
  entries: TimetableEntry[];
  onDrop: (item: { id: string; entry: TimetableEntry }, targetHour: number, targetDay: Dayjs) => void;
  isEditing: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ hour, day, entries, onDrop, isEditing }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'timetable-entry',
    drop: (item: { id: string; entry: TimetableEntry }) => onDrop(item, hour, day),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  drop(ref);

  return (
    <div
      ref={ref}
      className={`min-h-16 border-b border-gray-100 px-2 py-1 ${
        isOver && isEditing ? 'bg-blue-50 border-blue-200' : ''
      }`}
    >
      {entries.length === 0 && isEditing && isOver && (
        <div className="text-center text-gray-400 text-sm py-4 border-2 border-dashed border-blue-300 rounded-lg">
          Thả lịch trình vào đây
        </div>
      )}
    </div>
  );
};

const TimetableTimeline: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isEditing, isLoading, error,participent,curentCourseId} = useSelector((state: RootState) => state.schedule);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Dayjs>(dayjs().utc());
  const [selectedClass, setSelectedClass] = useState<string>('ql27.12');
const [inputClassName, setInputClassName] = useState<string>('');
const [updateContent,setUpdateContent] = useState<string>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchTimetable({ className: selectedClass }));
    }
  }, [selectedClass, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch({ type: 'schedule/clearError' });
    }
  }, [error, dispatch]);

  const currentWeekDays = useMemo(() => {
    const startOfWeek = selectedWeek.startOf('week');
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  }, [selectedWeek]);

  const timeSlots = useMemo(() => {
    const slots: { hour: number; label: string }[] = [];
    for (let hour = 7; hour <= 22; hour++) {
      slots.push({
        hour,
        label: `${hour.toString().padStart(2, '0')}:00`,
      });
    }
    return slots;
  }, []);

  const getEntriesForDayAndHour = (day: Dayjs, hour: number): TimetableEntry[] => {
    if (!data?.data) return [];
    return data.data.filter((entry: TimetableEntry) => {
      const entryDate = dayjs.utc(entry.startTime);
      const entryHour = entryDate.hour();
      return entryDate.isSame(day, 'day') && entryHour === hour;
    });
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    const startTime = dayjs.utc(entry.startTime);
    const endTime = dayjs.utc(entry.endTime);
    form.setFieldsValue({
      ...entry,
      date: startTime,
      startTime,
      endTime,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTimetableEntry(id)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        message.success('Đã xóa lịch trình');
        dispatch(sendEventTimeTable({title: 'Thông báo môn thời khóa biểu',body:`Mội môn học đã đưọc xóa khỏi lịch trình thường ngày của bạn, vui lòng theo dõi bảng thời khóa biểu mới nhất để cập nhật tình hình.`,type: 'timeTable',userNames: participent}));
      } else {
        message.error((result.payload as string) || 'Xóa thất bại');
      }
    });
  };

  const handleDrop = (item: { id: string; entry: TimetableEntry }, targetHour: number, targetDay: Dayjs) => {
    if (!isEditing) return;
    const entry = item.entry;
    const currentStart = dayjs.utc(entry.startTime);
    const currentEnd = dayjs.utc(entry.endTime);
    const duration = currentEnd.diff(currentStart, 'hour', true);
    const newStartUTC = targetDay.hour(targetHour).minute(0).second(0).utc();
    const newEndUTC = newStartUTC.add(duration, 'hour');

    dispatch(
      updateTimetableEntry({
        id: entry.id,
        newStartTime: newStartUTC.format('YYYY-MM-DDTHH:mm:ssZ'),
        newEndTime: newEndUTC.format('YYYY-MM-DDTHH:mm:ssZ'),
        zoomID: entry.zoomID,
        room: entry.room
      })
    ).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        message.success(
          `Đã di chuyển "${entry.subject}" đến ${newStartUTC.format('HH:mm')} ngày ${newStartUTC.format('DD/MM')}`
        );
        setUpdateContent(`Đã di chuyển "${entry.subject}" đến ${newStartUTC.format('HH:mm')} ngày ${newStartUTC.format('DD/MM')}`);
      } else {
        message.error((result.payload as string) || 'Di chuyển thất bại');
      }
    });
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { date, startTime, endTime, subject, room, zoomID, courseId } = values;
        const startTimeUTC = date.hour(startTime.hour()).minute(startTime.minute()).second(0).utc();
        const endTimeUTC = date.hour(endTime.hour()).minute(endTime.minute()).second(0).utc();
        const startTimeUTCv1 = date.hour(startTime.hour()+7).minute(startTime.minute()).second(0).utc();
        const endTimeUTCv1 = date.hour(endTime.hour()+7).minute(endTime.minute()).second(0).utc();

        const startTimeFormatted = startTimeUTC.format('YYYY-MM-DDTHH:mm:ssZ');
        const endTimeFormatted = endTimeUTC.format('YYYY-MM-DDTHH:mm:ssZ');

        const entryData: CreateTimetableEntryRequest = {
          subject,
          className: selectedClass,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          room,
          zoomID,
          type: 0,
          courseId: courseId,
        };

        const errors = validateTimetableEntry(entryData);
        if (errors.length > 0) {
          errors.forEach((error) => message.error(error));
          return;
        }

        if (editingEntry) {
          const updateData: UpdateTimetableEntryRequest = {
            id: editingEntry.id,
            newStartTime: entryData.startTime,
            newEndTime: entryData.endTime,
          };
          dispatch(updateTimetableEntry(updateData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              message.success('Đã cập nhật lịch trình');
              setIsModalVisible(false);
              setEditingEntry(null);
              dispatch(sendEventTimeTable({title: 'Thông báo thay đổi nhỏ về thời khóa biểu của bạn',body:`${generateContentNotification(data,editingEntry.id,editingEntry)}`,type: 'timeTable',userNames: participent}))
                            form.resetFields();
              form.resetFields();
            } else {
              message.error((result.payload as string) || 'Cập nhật thất bại');
            }
          });
        } else {
          entryData.startTime = startTimeUTCv1;
          entryData.endTime = endTimeUTCv1;
          dispatch(createTimetableEntry(entryData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              message.success('Đã thêm lịch trình mới');
              setIsModalVisible(false);
              dispatch(sendEventTimeTable({title: 'Buổi học mới',body:`Ban có thêm một buổi học mới vào ${date}: ${startTime}`,type: 'timeTable',userNames: participent}));
              form.resetFields();
            } else {
              message.error((result.payload as string) || 'Thêm thất bại');
            }
          });
        }
      })
      .catch(() => {
        message.error('Vui lòng kiểm tra lại thông tin nhập');
      });
  };

  const toggleEditMode = () => {
    dispatch(setEditMode(!isEditing));
    dispatch(sendEventTimeTable({title: 'Thông báo thay đổi nhỏ về thời khóa biểu của bạn',body:`${updateContent}`,type: 'timeTable',userNames: participent}))
  };

  const addNewEntry = () => {
    setEditingEntry(null);
    form.resetFields();
    const now = dayjs().utc();
    form.setFieldsValue({
      date: selectedWeek,
      startTime: now.hour(7).minute(0),
      endTime: now.hour(8).minute(0),
      className: selectedClass,
    });
    setIsModalVisible(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-50 min-h-screen p-6">
        {isLoading && <Spin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            closable
            className="mb-4 max-w-7xl mx-auto"
            onClose={() => dispatch({ type: 'schedule/clearError' })}
          />
        )}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Thời Khóa Biểu</h1>
                <p className="text-gray-600">Quản lý lịch trình học tập hiệu quả</p>
              </div>
              <div className="flex gap-3">
                <Button
                  type={isEditing ? 'default' : 'primary'}
                  onClick={toggleEditMode}
                  icon={<EditOutlined />}
                  disabled={isLoading}
                  className={isEditing ? '' : 'bg-blue-600 hover:bg-blue-700'}
                >
                  {isEditing ? 'Hoàn thành' : 'Chỉnh sửa'}
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addNewEntry}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 border-green-500"
                >
                  Thêm lịch trình
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedClass}
                onChange={setSelectedClass}
                className="w-48"
                options={[{ value: 'ql27.12', label: 'ql27.12' }]}
                placeholder="Chọn lớp"
                disabled={isLoading}
              />
              <div>
            <Input
            value={inputClassName}
            onChange={(e) => setInputClassName(e.target.value)}
            className="w-48 rounded-md"
            placeholder="Nhập tên lớp"
            />
        </div>
        <div>
            <Button onClick={() =>{
                dispatch(fetchTimetable({ className: inputClassName }));
              }}>
                GET
            </Button>
        </div>
              <DatePicker
                picker="week"
                value={selectedWeek}
                onChange={(date) => date && setSelectedWeek(date.utc())}
                className="w-48"
                format="DD/MM/YYYY"
                disabled={isLoading}
              />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarOutlined />
                <span>Tuần {selectedWeek.week()} năm {selectedWeek.year()}</span>
              </div>
            </div>
          </div>
          <Card className="shadow-sm rounded-lg overflow-hidden">
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-0 border border-gray-200">
              <div className="bg-gray-50 p-3 border-r border-gray-200 font-semibold text-center text-gray-700 sticky top-0 z-10">
                Thời gian
              </div>
              {currentWeekDays.map((day) => (
                <div
                  key={day.toString()}
                  className="bg-gray-50 p-3 border-r border-gray-200 text-center sticky top-0 z-10"
                >
                  <div className="font-semibold text-gray-800 capitalize">{day.format('dddd')}</div>
                  <div className="text-sm text-gray-600 mt-1">{day.format('DD/MM')}</div>
                </div>
              ))}
              {timeSlots.map((slot) => (
                <React.Fragment key={slot.hour}>
                  <div className="bg-gray-50 p-3 border-r border-t border-gray-200 text-center text-sm font-medium text-gray-700">
                    {slot.label}
                  </div>
                  {currentWeekDays.map((day) => {
                    const entries = getEntriesForDayAndHour(day, slot.hour);
                    return (
                      <div
                        key={`${day.toString()}-${slot.hour}`}
                        className="border-r border-t border-gray-200 p-2 bg-white min-h-[80px]"
                      >
                        <TimeSlot
                          hour={slot.hour}
                          day={day}
                          entries={entries}
                          onDrop={handleDrop}
                          isEditing={isEditing}
                        />
                        {entries.map((entry: TimetableEntry) => (
                          <DraggableEntry
                            key={entry.id}
                            entry={entry}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isEditing={isEditing}
                          />
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </Card>
          <Modal
            title={editingEntry ? 'Chỉnh sửa lịch trình' : 'Thêm lịch trình mới'}
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={() => {
              setIsModalVisible(false);
              setEditingEntry(null);
              form.resetFields();
            }}
            width={600}
            okText={editingEntry ? 'Cập nhật' : 'Thêm'}
            cancelText="Hủy"
            okButtonProps={{ disabled: isLoading, className: 'bg-blue-600 hover:bg-blue-700' }}
            footer={
              editingEntry
                ? [
                    <button
                      key="delete"
                      className="mr-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => handleDelete(editingEntry.id)}
                    >
                      Xóa
                    </button>,
                    <button
                      key="cancel"
                      className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      onClick={() => {
                        setIsModalVisible(false);
                        setEditingEntry(null);
                        form.resetFields();
                      }}
                    >
                      Hủy
                    </button>,
                    <button
                      key="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={handleModalOk}
                    >
                      Cập nhật
                    </button>,
                  ]
                : undefined
            }
          >
            <Form form={form} layout="vertical" className="space-y-4">
              <Form.Item
                name="subject"
                label="Môn học"
                rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
              >
                <Input placeholder="Nhập tên môn học" className="rounded-md" disabled={isLoading} />
              </Form.Item>
              <Form.Item
                name="className"
                label="Lớp học"
                rules={[{ required: true, message: 'Vui lòng nhập lớp học' }]}
                initialValue={selectedClass}
              >
                <Input placeholder="Nhập lớp học" className="rounded-md" disabled />
              </Form.Item>
              <Form.Item
                name="date"
                label="Ngày"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày' },
                  {
                    validator: (_, value: Dayjs) => {
                      if (value && value.isBefore(dayjs().utc(), 'day')) {
                        return Promise.reject('Không thể chọn ngày trong quá khứ');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  className="w-full rounded-md"
                  format="DD/MM/YYYY"
                  disabled={isLoading}
                  disabledDate={(date) => date.isBefore(dayjs().utc(), 'day')}
                />
              </Form.Item>
              <Form.Item
                name="startTime"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
              >
                <TimePicker className="w-full rounded-md" format="HH:mm" disabled={isLoading} />
              </Form.Item>
              <Form.Item
                name="endTime"
                label="Thời gian kết thúc"
                rules={[
                  { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                  {
                    validator: (_, value: Dayjs) => {
                      const startTime = form.getFieldValue('startTime');
                      if (startTime && value && value.isSameOrBefore(startTime)) {
                        return Promise.reject('Thời gian kết thúc phải sau thời gian bắt đầu');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TimePicker className="w-full rounded-md" format="HH:mm" disabled={isLoading} />
              </Form.Item>
              <Form.Item
                name="room"
                label="Phòng học"
              >
                <Input placeholder="Nhập phòng học" className="rounded-md" disabled={isLoading} />
              </Form.Item>
              <Form.Item name="zoomID" label="Zoom ID (tùy chọn)">
                <Input placeholder="Nhập ID phòng Zoom" className="rounded-md" disabled={isLoading} />
              </Form.Item>
              <Form.Item
                name="courseId"
                label="Mã khóa học"
                rules={[{ required: true, message: 'Vui lòng nhập mã khóa học' }]}
                initialValue={curentCourseId}
              >
                <Input placeholder="Nhập mã khóa học" className="rounded-md" disabled={isLoading} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </DndProvider>
  );
};

export default TimetableTimeline;