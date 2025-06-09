import { createAsyncThunk, createSlice, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import instance from '../../config/axios';
import { NOTIFICATION_ENDPOINT } from '../../services/endpoints';
import { RootState } from '../store';
import { SendNotificationByAcademic } from '../../types/Notification';
import {Notification} from '../../types/Notification';

// Valid notification types
// export enum NotificationType {
//   Default = 'default',
//   Event = 'event',
//   Warning = 'warning',
//   Announcement = 'announcement',
//   Reminder = 'reminder',
//   Urgent = 'urgent',
// }

// Interface for notification payload (camelCase to match backend)
export interface NotificationPayload {
  title: string;
  body: string;
  type: string;
  requestId: string;
  priority: string;
  deliveryChannels: string[];
  scheduleEnabled: boolean;
  scheduledTime: string | null;
  imageFile: {
    fileName: string;
    fileData: string | Blob; // hoặc kiểu phù hợp nếu đã xác định rõ
  } | null;
  facultyCodes: string[];
  courseCodes: string[];
  classCodes: string[];
  userNames: string[];
  sendAll: boolean;
  timestamp: string;
  createdBy: string;
}

// Interface for notification state
interface NotificationState {
  loading: boolean;
  success: boolean;
  error: string | null;
  notificationHistory: Notification[]; // Store last sent payload for debugging
}

// Initial state
const initialState: NotificationState = {
  loading: false,
  success: false,
  error: null,
  notificationHistory: [],
};


export const getHistoryNotification = createAsyncThunk<
  Notification[],
  {
    startAt: number;
    pageSize?: number;
  },
  { rejectValue: string }
>(
  'notification/getNotification',
  async ({ startAt, pageSize}, { rejectWithValue }) => {
    try {
      const params = {
        startAt,
        pageSize,
      };

      const response = await instance.NOTIFICATION_SERVICE.get(
        NOTIFICATION_ENDPOINT.GET_HISTORY,
        { params }
      );

      return response as Notification[];
    } catch (error: any) {
      let errorMessage = 'Không thể lấy danh sách thông báo';

      if (error.response?.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteNotification = createAsyncThunk<
  string,
  {id: string},
  { rejectValue: string }
>(
  'notification/deleteNotification',
  async (id, { rejectWithValue }) =>{
    try{
      if(id == null){
      return rejectWithValue("Id khong duoc de trong");
    }
    const response = await instance.NOTIFICATION_SERVICE.delete(NOTIFICATION_ENDPOINT.DELETE_NOTIFICATION_ID+id);
    return response;
    }catch (error: any) {
      let errorMessage = 'Không thể xoa';

      if (error.response?.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);


// Async thunk to send notification with validation and retry
export const sendNotification = createAsyncThunk<
  Notification,
  {payload: NotificationPayload},
  { rejectValue: string }
>(
  'notification/sendNotification',
  async ({payload}, { rejectWithValue }) => {
    // Validate payload
    if (!payload.title?.trim()) {
      return rejectWithValue('Tiêu đề thông báo không được để trống');
    }
    if (!payload.body?.trim()) {
      return rejectWithValue('Nội dung thông báo không được để trống');
    }
    if (
      !payload.sendAll &&
      (!payload.facultyCodes?.length &&
       !payload.courseCodes?.length &&
       !payload.classCodes?.length &&
       !payload.userNames?.length)
    ) {
      return rejectWithValue('Cần ít nhất một điều kiện khi không gửi cho tất cả');
    }

    // Retry logic for network errors
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const response = await instance.NOTIFICATION_SERVICE.post(NOTIFICATION_ENDPOINT.POST_SENT_BY_CONDITION, payload);
        return response;
      } catch (error: any) {
        attempt++;
        let errorMessage = 'Đã có lỗi xảy ra khi gửi thông báo';
        if (error.response?.message) {
          errorMessage = error.response.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        if (attempt === maxRetries) {
          return rejectWithValue(errorMessage);
        }

        // Exponential backoff: wait 2^attempt seconds
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
);

// Async thunk to send academic notification with validation and retry
export const sendAcademicNotification = createAsyncThunk<
  Notification,
  { payload: SendNotificationByAcademic },
  { rejectValue: string }
>(
  'notification/sendAcademicNotification',
  async ({ payload }, { rejectWithValue }) => {
    // ===== VALIDATION =====
    if (!payload.type?.trim()) {
      return rejectWithValue('Loại thông báo không được để trống');
    }

    if (!payload.body?.trim()) {
      return rejectWithValue('Nội dung thông báo không được để trống');
    }

    if (!payload.sendAll && (!payload.recipients || payload.recipients.length === 0)) {
      return rejectWithValue('Vui lòng chọn người nhận hoặc chọn gửi cho tất cả');
    }

    // ===== RETRY LOGIC =====
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await instance.NOTIFICATION_SERVICE.post(
          NOTIFICATION_ENDPOINT.POST_SEND_BY_ACADEMIC,
          payload
        );
        return response; // Return success response if needed
      } catch (error: any) {
        attempt++;

        // Parse meaningful error
        let errorMessage = 'Đã có lỗi xảy ra khi gửi thông báo';
        if (error.response?.message) {
          errorMessage = error.response.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Nếu đã thử đủ số lần → reject
        if (attempt === maxRetries) {
          return rejectWithValue(errorMessage);
        }

        // Đợi exponential backoff: 2^attempt giây
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }
);


// Notification slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Clear error state
    clearError(state) {
      state.error = null;
    },
    // Clear success state
    clearSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fulfilled state
      .addCase(sendNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.loading = false;
        const newNotification = action.payload;

        if (newNotification) {
          if (!state.notificationHistory) {
            state.notificationHistory = [];
          }
          state.notificationHistory.unshift(newNotification); // Đưa vào đầu danh sách
        }

        state.success = true;
      })
      .addCase(sendAcademicNotification.fulfilled, (state, action: PayloadAction<Notification>) => {
        state.loading = false;
        const newNotification = action.payload;

        if (newNotification) {
          if (!state.notificationHistory) {
            state.notificationHistory = [];
          }
          state.notificationHistory.unshift(newNotification); // Đưa vào đầu danh sách
        }

        state.success = true;
      })
      .addCase(getHistoryNotification.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.loading = false;
        const notifications = action.payload;
        
        if (notifications.length !== 0) {
          if (!state.notificationHistory) {
            state.notificationHistory = [];
          }
          
          // Nếu startAt = 0, nghĩa là reset data
          const isReset = state.notificationHistory.length === 0;
          
          if (isReset) {
            state.notificationHistory = notifications;
          } else {
            // Append new data, tránh duplicate
            const existingIds = state.notificationHistory.map(item => item.id);
            const newNotifications = notifications.filter(
              item => !existingIds.includes(item.id)
            );
            state.notificationHistory = [...state.notificationHistory, ...newNotifications];
          }
        }
        state.success = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const deletedId = action.payload.trim();
        if (deletedId) {
          state.notificationHistory = state.notificationHistory.filter(
            (notification) => notification.id !== deletedId
          );
        }
        state.success = true;
      })
      // GLOBAL MATCHERS
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  },
});

export const { clearError, clearSuccess } = notificationSlice.actions;

// Selectors
export const selectNotificationLoading = (state: RootState) => state.notification.loading;
export const selectNotificationSuccess = (state: RootState) => state.notification.success;
export const selectNotificationError = (state: RootState) => state.notification.error;
export const selectNotificationHistory = (state: RootState) => state.notification.notificationHistory;

export default notificationSlice.reducer;