import { Alert, Badge, Button, Calendar, DatePicker, Form, Input, message, Modal, Select, Spin, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/vi';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTimetableEntry,
  CreateTimetableEntryRequest,
  deleteTimetableEntry,
  fetchTimetable,
  TimetableEntry,
  updateTimetableEntry,
  UpdateTimetableEntryRequest,
} from '../../../store/slices/scheduleSlice';
import { AppDispatch, RootState } from '../../../store/store';
import { getSubjectColor, validateTimetableEntry } from './unit';
import { sendEventTimeTable } from '../../../store/slices/notificationSlice';
import { generateContentNotification } from './hepler';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.locale('vi'); // Use Vietnamese locale

const CalendarView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, isLoading, error,participent,curentCourseId } = useSelector((state: RootState) => state.schedule);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('ql27.12');
  const [inputClassName, setInputClassName] = useState<string>('');
  const [form] = Form.useForm();


  

  // Fetch timetable when class changes
  useEffect(() => {
    if (selectedClass) {
      dispatch(fetchTimetable({ className: selectedClass }));
    }
  }, [selectedClass, dispatch,]);
  const getTimeTableByInput =() =>{
    dispatch(fetchTimetable({ className: inputClassName }));
  }

  const dateCellRender = (value: Dayjs) => {
    const entries = data?.data?.filter((entry: TimetableEntry) =>
      dayjs.utc(entry.startTime).isSame(value, 'day')
    ) || [];

    return (
      <ul className="space-y-1 p-2">
        {entries.map((entry: TimetableEntry) => (
          <li key={entry.id}>
            <Badge
              color={getSubjectColor(entry.subject)}
              text={
                <div
                  className="text-sm text-gray-700 hover:bg-gray-100 p-1 rounded cursor-pointer transition-colors"
                  onClick={() => {
                    setEditingEntry(entry);
                    form.setFieldsValue({
                      ...entry,
                      date: dayjs.utc(entry.startTime),
                      startTime: dayjs.utc(entry.startTime),
                      endTime: dayjs.utc(entry.endTime),
                    });
                    setIsModalVisible(true);
                  }}
                >
                  <div>{`${dayjs.utc(entry.startTime).format('HH:mm')} - ${dayjs.utc(entry.endTime).format('HH:mm')}`}</div>
                  <div className="font-medium">{entry.subject}</div>
                  <div className="text-xs text-gray-500">{`Phòng: ${entry.room}${entry.zoomID ? `, Zoom: ${entry.zoomID}` : ''}`}</div>
                </div>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { date, startTime, endTime, subject, room, zoomID, courseId } = values;

        const startTimeFormatted = date
          .hour(startTime.hour())
          .minute(startTime.minute())
          .second(0)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ssZ');

        const endTimeFormatted = date
          .hour(endTime.hour())
          .minute(endTime.minute())
          .second(0)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ssZ');

        const startTimeFormattedv1 = date
          .hour(startTime.hour()+7)
          .minute(startTime.minute())
          .second(0)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ssZ');

        const endTimeFormattedv1 = date
          .hour(endTime.hour()+7)
          .minute(endTime.minute())
          .second(0)
          .utc()
          .format('YYYY-MM-DDTHH:mm:ssZ');

        const entryData: CreateTimetableEntryRequest = {
          subject,
          className: selectedClass,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
          room,
          zoomID,
          type: 0,
          courseId: courseId || `course-${Date.now()}`,
        };

        console.log('Submitting entryData:', entryData);

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
            zoomID: entryData.zoomID,
            room: entryData.room
          };
          dispatch(updateTimetableEntry(updateData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              message.success('Đã cập nhật lịch trình');
              setIsModalVisible(false);
              setEditingEntry(null);
              dispatch(sendEventTimeTable({title: 'Thông báo thay đổi nhỏ về thời khóa biểu của bạn',body:`${generateContentNotification(data,editingEntry.id,editingEntry)}`,type: 'timeTable',userNames: participent}))
              form.resetFields();
            } else {
              message.error((result.payload as string) || 'Cập nhật thất bại');
            }
          });
        } else {
          entryData.startTime = startTimeFormattedv1;
          entryData.endTime = endTimeFormattedv1;
          dispatch(createTimetableEntry(entryData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
              message.success('Đã thêm lịch trình mới');
              setIsModalVisible(false);
              dispatch(sendEventTimeTable({title: 'Buổi học mới',body:`Ban có thêm một buổi học mới vào ${date}: ${startTime}`,type: 'timeTable',userNames: participent}))
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

  const handleDelete = () => {
    if (editingEntry) {
      dispatch(deleteTimetableEntry(editingEntry.id)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          message.success('Đã xóa lịch trình');
          setIsModalVisible(false);
          setEditingEntry(null);
          dispatch(sendEventTimeTable({title: 'Thông báo môn thời khóa biểu',body:`Bạn đã hoàn thành môn học ${editingEntry.subject} nên không cần phải lên lớp với buổi học này nữa.`,type: 'timeTable',userNames: participent}));
          form.resetFields();
        } else {
          message.error((result.payload as string) || 'Xóa thất bại');
        }
      });
    }
  };

  const handleDateSelect = (date: Dayjs) => {
    setEditingEntry(null);
    form.setFieldsValue({
      date,
      startTime: dayjs().utc().hour(7).minute(0),
      endTime: dayjs().utc().hour(8).minute(0),
      className: selectedClass,
    });
    setIsModalVisible(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {isLoading && <Spin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          closable
          className="mb-4"
          onClose={() => dispatch({ type: 'schedule/clearError' })}
        />
      )}
      <div className="mb-4 flex items-center gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lớp học</label>
            <Select
            value={selectedClass}
            onChange={setSelectedClass}
            className="w-48"
            options={[{ value: 'ql27.12', label: 'ql27.12' }]}
            placeholder="Chọn lớp"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lớp khác</label>
            <Input
            value={inputClassName}
            onChange={(e) => setInputClassName(e.target.value)}
            className="w-48 rounded-md"
            placeholder="Nhập tên lớp"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <Button onClick={getTimeTableByInput}>
                GET
            </Button>
        </div>
        </div>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateSelect}
        className="bg-white shadow-md rounded-lg p-4"
      />
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
        okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700' }}
        footer={
          editingEntry
            ? [
                <button
                  key="delete"
                  className="mr-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
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
            <Input placeholder="Nhập tên môn học" className="rounded-md" />
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
              disabledDate={(date) => date.isBefore(dayjs().utc(), 'day')}
            />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
          >
            <TimePicker className="w-full rounded-md" format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
              {
                validator: (_, value: Dayjs) => {
                  const startTime = form.getFieldValue('startTime');
                  if (!startTime || !value) {
                    return Promise.resolve();
                  }
                  const start = dayjs(startTime);
                  const end = dayjs(value);
                  if (end.isSameOrBefore(start)) {
                    return Promise.reject('Thời gian kết thúc phải sau thời gian bắt đầu');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TimePicker className="w-full rounded-md" format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="room"
            label="Phòng học"
          >
            <Input placeholder="Nhập phòng học" className="rounded-md" />
          </Form.Item>
          <Form.Item name="zoomID" label="Zoom ID (tùy chọn)">
            <Input placeholder="Nhập ID phòng Zoom" className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="courseId"
            label="Mã khóa học"
            rules={[{ required: true, message: 'Vui lòng nhập mã khóa học' }]}
            initialValue={curentCourseId}
          >
            <Input placeholder="Nhập mã khóa học" className="rounded-md" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CalendarView;