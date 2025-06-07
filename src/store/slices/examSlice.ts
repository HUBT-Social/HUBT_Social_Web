import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instance from '../../config/axios';
import { RootState } from '../store';

// Định nghĩa interface cho Exam
export interface Exam {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Định nghĩa trạng thái cho slice
interface ExamState {
  loading: boolean;
  exams: Exam[];
  error: string | null;
}

const initialState: ExamState = {
  loading: false,
  exams: [],
  error: null,
};

// Thunk để lấy danh sách bài kiểm tra
export const fetchExams = createAsyncThunk<
  Exam[],
  void,
  { rejectValue: string }
>(
  'exams/fetchExams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.get('/exams');
      return response.data as Exam[];
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi lấy danh sách bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để thêm bài kiểm tra
export const addExam = createAsyncThunk<
  Exam,
  { title: string; description: string },
  { rejectValue: string }
>(
  'exams/addExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.post('/exams', examData);
      return response.data as Exam;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi thêm bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để sửa bài kiểm tra
export const updateExam = createAsyncThunk<
  Exam,
  { id: string; title: string; description: string },
  { rejectValue: string }
>(
  'exams/updateExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.put(`/exams/${examData.id}`, {
        title: examData.title,
        description: examData.description,
      });
      return response.data as Exam;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi sửa bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để xóa bài kiểm tra
export const deleteExam = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'exams/deleteExam',
  async (id, { rejectWithValue }) => {
    try {
      await instance.TEMP_SERVICE.delete(`/exams/${id}`);
      return id;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi xóa bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Exams
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action: PayloadAction<Exam[]>) => {
        state.loading = false;
        state.exams = action.payload;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
        state.exams = [];
      })
      // Add Exam
      .addCase(addExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExam.fulfilled, (state, action: PayloadAction<Exam>) => {
        state.loading = false;
        state.exams.push(action.payload);
      })
      .addCase(addExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
      })
      // Update Exam
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action: PayloadAction<Exam>) => {
        state.loading = false;
        const index = state.exams.findIndex((exam) => exam.id === action.payload.id);
        if (index !== -1) {
          state.exams[index] = action.payload;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
      })
      // Delete Exam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.exams = state.exams.filter((exam) => exam.id !== action.payload);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
      });
  },
});

export const { clearError } = examSlice.actions;

// Selectors
export const selectExams = (state: RootState) => state.exams.exams;
export const selectExamsLoading = (state: RootState) => state.exams.loading;
export const selectExamsError = (state: RootState) => state.exams.error;

export default examSlice.reducer;