import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import instance from '../../config/axios';
import { RootState } from '../store';
import { Exam } from '../../types/exams';

// Define QuizDetail type based on the output
interface QuizDetail {
  Title: string;
  Description: string;
  Image: string;
  Major: string;
  Credits: number;
  Questions: any[]; // Adjust based on your Question type
}

// Define ExamState with pagination and filtering
interface ExamState {
  loading: boolean;
  exams: Exam[];
  error: string | null;
  filteredExams: Exam[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filter: {
    status?: 'draft' | 'approved' | 'pending' | 'all';
    searchTerm?: string;
    major?: string;
  };
}

const initialState: ExamState = {
  loading: false,
  exams: [],
  error: null,
  filteredExams: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  filter: {
    status: 'all',
    searchTerm: '',
    major: '',
  },
};

// Thunk to fetch exams with pagination and filtering by major
export const fetchExams = createAsyncThunk<
  { data: Exam[]; total: number },
  { page: number; pageSize: number; major?: string },
  { rejectValue: string }
>(
  'exams/fetchExams',
  async ({ page, pageSize, major }, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.get('/exams', {
        params: { page: page - 1, limit: pageSize, major },
      });
      const total = response.headers['x-total-count'] || response.data.length;
      return { data: response.data as Exam[], total };
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi lấy danh sách bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('Fetch Exams Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to add exam with file upload
export const addExam = createAsyncThunk<
  QuizDetail,
  { title: string; description: string; major: string; file?: File },
  { rejectValue: string }
>(
  'exams/addExam',
  async (examData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('Title', examData.title);
      formData.append('Description', examData.description);
      formData.append('Major', examData.major);
      if (examData.file) formData.append('File', examData.file);

      const response = await instance.TEMP_SERVICE.post('/extract-questions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data as QuizDetail;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi thêm bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('Add Exam Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to update exam
export const updateExam = createAsyncThunk<
  Exam,
  { id: string; title: string; description: string; status?: string; major?: string },
  { rejectValue: string }
>(
  'exams/updateExam',
  async (examData, { rejectWithValue }) => {
    try {
      const response = await instance.TEMP_SERVICE.put(`/exams/${examData.id}`, {
        title: examData.title,
        description: examData.description,
        status: examData.status,
        major: examData.major,
      });
      return response.data as Exam;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi sửa bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('Update Exam Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to delete exam
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
      console.error('Delete Exam Error:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk to bulk delete exams
export const bulkDeleteExams = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>(
  'exams/bulkDeleteExams',
  async (ids, { rejectWithValue }) => {
    try {
      await Promise.all(ids.map(id => instance.TEMP_SERVICE.delete(`/exams/${id}`)));
      return ids;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi xóa nhiều bài kiểm tra';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('Bulk Delete Exams Error:', error);
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
    setFilter(state, action: PayloadAction<{ status?: string; searchTerm?: string; major?: string }>) {
      console.log(action);
      //state.filter = { ...state.filter, ...action.payload };
      state.filteredExams = state.exams.filter(exam => {
        const matchesStatus = !state.filter.status || state.filter.status === 'all' || exam.status === state.filter.status;
        const matchesSearch = !state.filter.searchTerm || 
          exam.title.toLowerCase().includes(state.filter.searchTerm.toLowerCase()) ||
          exam.description.toLowerCase().includes(state.filter.searchTerm.toLowerCase());
        const matchesMajor = !state.filter.major || exam.major.toLowerCase().includes(state.filter.major.toLowerCase());
        return matchesStatus && matchesSearch && matchesMajor;
      });
    },
    setPagination(state, action: PayloadAction<{ current: number; pageSize: number }>) {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setExams(state, action: PayloadAction<Exam[]>) { // Add the setExams reducer
      state.exams = action.payload;
      state.filteredExams = action.payload; // Update filteredExams to match exams
      state.pagination.total = action.payload.length; // Update total based on new data
    },
  },
  extraReducers: (builder) => {
    // Fetch Exams
    builder
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action: PayloadAction<{ data: Exam[]; total: number }>) => {
        state.loading = false;
        state.exams = action.payload.data;
        state.filteredExams = action.payload.data;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
        state.exams = [];
        state.filteredExams = [];
      })
      // Add Exam
      .addCase(addExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExam.fulfilled, (state, action: PayloadAction<QuizDetail>) => {
        state.loading = false;
        const exam: Exam = {
          id: (state.exams.length + 1).toString(), // Temporary ID, replace with actual ID from response if available
          title: action.payload.Title,
          description: action.payload.Description,
          fileName: action.payload.Image || '', // Map Image to fileName if applicable
          major: action.payload.Major,
          createdDate: new Date().toISOString(),
          status: 'pending', // Default status, adjust based on API
        };
        state.exams.push(exam);
        state.filteredExams.push(exam);
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
          state.filteredExams = state.exams.filter(exam => {
            const matchesStatus = !state.filter.status || state.filter.status === 'all' || exam.status === state.filter.status;
            const matchesSearch = !state.filter.searchTerm || 
              exam.title.toLowerCase().includes(state.filter.searchTerm.toLowerCase()) ||
              exam.description.toLowerCase().includes(state.filter.searchTerm.toLowerCase());
            const matchesMajor = !state.filter.major || exam.major.toLowerCase().includes(state.filter.major.toLowerCase());
            return matchesStatus && matchesSearch && matchesMajor;
          });
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
        state.filteredExams = state.filteredExams.filter((exam) => exam.id !== action.payload);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
      })
      // Bulk Delete Exams
      .addCase(bulkDeleteExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteExams.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.exams = state.exams.filter((exam) => !action.payload.includes(exam.id!));
        state.filteredExams = state.filteredExams.filter((exam) => !action.payload.includes(exam.id!));
      })
      .addCase(bulkDeleteExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
      });
  },
});

export const { clearError, setFilter, setPagination,setExams } = examSlice.actions;

// Selectors
export const selectExams = (state: RootState) => state.exams.exams;
export const selectFilteredExams = (state: RootState) => state.exams.filteredExams;
export const selectExamsLoading = (state: RootState) => state.exams.loading;
export const selectExamsError = (state: RootState) => state.exams.error;
export const selectPagination = (state: RootState) => state.exams.pagination;
export const selectFilter = (state: RootState) => state.exams.filter;


export default examSlice.reducer;