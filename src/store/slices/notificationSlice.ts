import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instance from '../../config/axios';
import { RootState } from '../store';
import { NOTIFICATION_ENDPOINT } from '../../services/endpoints';
import axios from 'axios';

// Valid notification types
export enum NotificationType {
  Default = 'default',
  Event = 'event',
  Warning = 'warning',
  Announcement = 'announcement',
  Reminder = 'reminder',
  Urgent = 'urgent',
}

// Interface for notification payload (camelCase to match backend)
export interface NotificationPayload {
  title: string;
  body: string;
  image?: { base64String: string; fileName: string } | null;
  requestId?: string | null;
  type: NotificationType;
  facultyCodes?: string[];
  courseCodes?: string[];
  classCodes?: string[];
  userNames?: string[];
  sendAll: boolean;
}

// Interface for notification state
interface NotificationState {
  loading: boolean;
  success: boolean;
  error: string | null;
  lastPayload?: NotificationPayload; // Store last sent payload for debugging
}

// Initial state
const initialState: NotificationState = {
  loading: false,
  success: false,
  error: null,
  lastPayload: undefined,
};


// Async thunk to send notification with validation and retry
export const sendNotification = createAsyncThunk<
  void,
  {payload: NotificationPayload, token: string},
  { rejectValue: string }
>(
  'notification/sendNotification',
  async ({payload,token}, { rejectWithValue }) => {
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
        await axios.post('https://localhost:7197'+ NOTIFICATION_ENDPOINT.POST_SENT_BY_CONDITION, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return;
      } catch (error: any) {
        attempt++;
        let errorMessage = 'Đã có lỗi xảy ra khi gửi thông báo';
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
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
      // Handle pending state
      .addCase(sendNotification.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.lastPayload = action.meta.arg.payload; // Store payload
      })
      // Handle fulfilled state
      .addCase(sendNotification.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      // Handle rejected state
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess } = notificationSlice.actions;

// Selectors
export const selectNotificationLoading = (state: RootState) => state.notification.loading;
export const selectNotificationSuccess = (state: RootState) => state.notification.success;
export const selectNotificationError = (state: RootState) => state.notification.error;
export const selectLastNotificationPayload = (state: RootState) => state.notification.lastPayload;

export default notificationSlice.reducer;