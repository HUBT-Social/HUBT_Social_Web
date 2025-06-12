import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import instance from '../../config/axios';

// Define types based on the API response
export interface TimetableEntry {
  id: string;
  className: string;
  startTime: string; // ISO 8601 string (e.g., "2025-06-11T15:00:00Z")
  endTime: string;   // ISO 8601 string
  subject: string;
  room: string;
  zoomID: string;
  courseId: string;
  type: number;
}

export interface TimetableData {
  data: TimetableEntry[];
  message: string;
  statusCode: number;
}

export interface TimetableState {
  data: TimetableData | null;
  participent: string[],
  curentCourseId: string | null,
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

export interface UpdateTimetableEntryRequest {
  id: string;
  newStartTime?: string;
  newEndTime?: string;
  zoomID?: string,
  room?: string
}

// Async thunk to fetch timetable by className
export const fetchTimetable = createAsyncThunk<
  {timetable: TimetableData, participent: string[]},
  { className: string},
  { rejectValue: string }
>(
  'schedule/fetchTimetable',
  async ({ className}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('className', className);

      const response = await instance.TEMP_SERVICE.get(`/api/temptimetable?${queryParams.toString()}`);
      const responseGetParticipent = await instance.TEMP_SERVICE.get(`/api/tempCourse/get-usernames-inclass?${queryParams.toString()}`);
      return {timetable: response as TimetableData,participent: responseGetParticipent.data};
    } catch (error: any) {
      return rejectWithValue(error.response?.message || 'Failed to fetch timetable');
    }
  }
);

// Async thunk to create a timetable entry
export const createTimetableEntry = createAsyncThunk<
  TimetableEntry,
  CreateTimetableEntryRequest,
  { rejectValue: string }
>(
  'schedule/createEntry',
  async (entry, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.post('/api/temptimetable', entry);
      return response.data as TimetableEntry;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create timetable entry');
    }
  }
);

// Async thunk to update a timetable entry
export const updateTimetableEntry = createAsyncThunk<
  TimetableEntry, // Return type
  UpdateTimetableEntryRequest, // Input type
  { rejectValue: string } // Error type
>(
  'schedule/updateEntry',
  async ({ id, newStartTime, newEndTime, room, zoomID }, { rejectWithValue }) => {
    // Validate input
    if (!id) {
      return rejectWithValue('ID không được để trống.');
    }
    if (!newStartTime && !newEndTime && !room && !zoomID) {
      return rejectWithValue('Phải cung cấp ít nhất một trường để cập nhật.');
    }

    // Build query parameters
    const queryParams = new URLSearchParams({ id });
    if (newStartTime) {
      queryParams.append('newStartTime', newStartTime);
    }
    if (newEndTime) {
      queryParams.append('newEndTime', newEndTime);
    }
    if (zoomID) {
      queryParams.append('zoomID', zoomID);
    }
    if (room) {
      queryParams.append('room', room);
    }

    try {
      const response = await instance.TEMP_SERVICE.put(
        `/api/temptimetable/change-schedule-timetable?${queryParams.toString()}`
      );
      return response.data as TimetableEntry;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Đã xảy ra lỗi khi cập nhật thời khóa biểu.';
      return rejectWithValue(message);
    }
  }
);

// Async thunk to delete a timetable entry
export const deleteTimetableEntry = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'schedule/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await instance.TEMP_SERVICE.delete(`/api/temptimetable?id=${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete timetable entry');
    }
  }
);

const initialState: TimetableState = {
  data: null,
  participent: [],
  curentCourseId: null,
  selectedEntry: null,
  isEditing: false,
  isLoading: false,
  error: null,
  viewMode: 'week',
  selectedDate: new Date().toISOString().split('T')[0],
};

const timetableSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSelectedEntry: (state, action: PayloadAction<TimetableEntry | null>) => {
      state.selectedEntry = action.payload;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'week' | 'day' | 'month'>) => {
      state.viewMode = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateEntryTime: (state, action: PayloadAction<{ id: string; startTime: string; endTime: string }>) => {
      if (state.data?.data) {
        const entry = state.data.data.find((e) => e.id === action.payload.id);
        if (entry) {
          entry.startTime = action.payload.startTime;
          entry.endTime = action.payload.endTime;
        }
      }
    },
    setMockData: (state, action: PayloadAction<TimetableData>) => {
      state.data = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimetable.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTimetable.fulfilled, (state, action: PayloadAction<{timetable: TimetableData, participent: string[]}>) => {
        state.isLoading = false;
        state.data = action.payload.timetable;
        state.participent = action.payload.participent;
        state.curentCourseId = action.payload.timetable.data[0].courseId;
      })
      .addCase(fetchTimetable.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch timetable';
      })
      .addCase(createTimetableEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTimetableEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data?.data) {
          state.data.data.push(action.payload);
        } else {
          state.data = { data: [action.payload], message: 'Created', statusCode: 200 };
        }
      })
      .addCase(createTimetableEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create timetable entry';
      })
      .addCase(updateTimetableEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTimetableEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data?.data) {
          const index = state.data.data.findIndex((e) => e.id === action.payload.id);
          if (index !== -1) {
            console.log("new: ", action.payload);
            state.data.data[index] = action.payload;
          }
        }
      })
      .addCase(updateTimetableEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update timetable entry';
      })
      .addCase(deleteTimetableEntry.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTimetableEntry.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data?.data) {
          state.data.data = state.data.data.filter((e) => e.id !== action.payload);
        }
      })
      .addCase(deleteTimetableEntry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete timetable entry';
      });
  },
});

export const {
  setSelectedEntry,
  setEditMode,
  setViewMode,
  setSelectedDate,
  clearError,
  updateEntryTime,
  setMockData,
} = timetableSlice.actions;

export default timetableSlice.reducer;
export const selectTimetable = (state: RootState) => state.schedule.data;
export const selectParticipents = (state: RootState) => state.schedule.participent;