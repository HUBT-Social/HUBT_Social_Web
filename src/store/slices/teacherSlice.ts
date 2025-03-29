import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Teacher } from '../../types/Teacher';
import {teachers} from '../../assets/fake_data/teachers';


// Định nghĩa trạng thái cho slice
interface TeacherState {
  loading: boolean;
  teachers: Teacher[];
  error: string | null;
}

const initialState: TeacherState = {
  loading: false,
  teachers: [],
  error: null,
};

// Async thunk để lấy danh sách giáo viên
export const getTeachers = createAsyncThunk<
  Teacher[],
  void,
  { rejectValue: string }
>(
  'teachers/get',
  async (_, { rejectWithValue }) => {
    try {
    //   const response = await instance.get('/teachers'); // Thay bằng endpoint thật của bạn
    //   return response.data as Teacher[];
        return teachers as Teacher[];
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi lấy danh sách giáo viên';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(getTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
        state.teachers = [];
      });
  },
});

export const { clearError } = teacherSlice.actions;

// Selectors
export const selectTeachers = (state: RootState) => state.teachers.teachers;
export const selectTeachersLoading = (state: RootState) => state.teachers.loading;
export const selectTeachersError = (state: RootState) => state.teachers.error;

export default teacherSlice.reducer;