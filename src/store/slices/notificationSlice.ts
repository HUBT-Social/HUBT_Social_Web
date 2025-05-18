import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instance from '../../config/axios';
import { RootState } from '../store';

// Định nghĩa interface cho payload gửi thông báo
export interface NotificationPayload {
  Title: string;
  Body: string;
  Image?: { Base64String: string; FileName: string } | null;
  RequestId: string | null;
  Type: string;
  FacultyCodes: string[] | null;
  CourseCodes: string[] | null;
  ClassCodes: string[] | null;
  UserNames: string[] | null;
  SendAll: boolean;
}

// Định nghĩa trạng thái cho slice
interface NotificationState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  loading: false,
  success: false,
  error: null,
};

// Async thunk để gửi thông báo
export const sendNotification = createAsyncThunk<
  void,
  NotificationPayload,
  { rejectValue: string }
>(
  'notification/sendNotification',
  async (payload, { rejectWithValue }) => {
    try {
      await instance.post('/notifications', payload); 
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi gửi thông báo';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
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

export default notificationSlice.reducer;