import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import instance from '../../config/axios';
import { RootState } from '../store';
import { AverageScore } from '../../types/Student';
import { UserInfo } from '../../types/userInfo';

// Simplified filter interface
export interface Filter {
  searchTerm: string;
  currentPage: number;
  isServerSearch: boolean;
}

// Interface for state
interface StudentState {
  loading: boolean;
  students: UserInfo[]; // All students (from server)
  studentsFiltered: UserInfo[]; // Filtered students (client-side)
  averageScore: AverageScore[];
  error: string | null;
  filter: Filter;
  isLoaded: boolean;
  hasMore: boolean;
}

// Initial state
const initialState: StudentState = {
  loading: false,
  students: [],
  studentsFiltered: [],
  averageScore: [],
  error: null,
  filter: {
    searchTerm: '',
    currentPage: 1,
    isServerSearch: false
  },
  isLoaded: false,
  hasMore: true,
};


// ========================
// Async Thunks
// ========================

// Simplified getStudents thunk
export const getStudents = createAsyncThunk<
  { students: UserInfo[]; hasMore: boolean; isAppend: boolean },
  { searchTerm?: string; page?: number; isLoadMore?: boolean },
  { rejectValue: string }
>('students/get', async ({ searchTerm = '', page = 1, isLoadMore = false }, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('roleName', 'USER');
    queryParams.append('page', page.toString());
    
    if (searchTerm.trim()) {
      queryParams.append('filter', searchTerm);
    }

    const res = await instance.USER_SERVICE.get(
      `/api/user/get-user-by-role?${queryParams.toString()}`
    );

    return {
      students: res.aUserDTOs || [],
      hasMore: res.hasMore || false,
      isAppend: isLoadMore && page > 1
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Không thể tải danh sách sinh viên'
    );
  }
});

// Load more students (for pagination)
export const loadMoreStudents = createAsyncThunk<
  { students: UserInfo[]; hasMore: boolean },
  void,
  { rejectValue: string; state: RootState }
>('students/loadMore', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const { filter } = state.students;
    
    const queryParams = new URLSearchParams();
    queryParams.append('roleName', 'USER');
    queryParams.append('page', (filter.currentPage + 1).toString());
    
    if (filter.searchTerm.trim()) {
      queryParams.append('filter', filter.searchTerm);
    }

    const res = await instance.USER_SERVICE.get(
      `/api/user/get-user-by-role?${queryParams.toString()}`
    );

    return {
      students: res.aUserDTOs || [],
      hasMore: res.hasMore || false
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Không thể tải thêm sinh viên'
    );
  }
});

export const getAverageScore = createAsyncThunk<
  AverageScore[],
  void,
  { rejectValue: string }
>('students/getScore', async (_, { rejectWithValue }) => {
  try {
    let hasMore = true;
    let page = 0;
    const scores: AverageScore[] = [];

    while (hasMore) {
      const res = await instance.OUT_SERVICE.get<{
        data: {
          scores: AverageScore[];
          hasMore: boolean;
        };
        message: string;
        statusCode: number;
      }>(`/api/hubt/getSliceScore?page=${page}`);

      const currentScores = res.data.scores;
      scores.push(...currentScores);
      console.log('Score: ', scores.length);
      hasMore = res.data.hasMore;
      page++;
    }

    return scores;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        'Không thể tải danh sách sinh viên'
    );
  }
});

// Add a new student
export const addStudent = createAsyncThunk<
  UserInfo,
  UserInfo,
  { rejectValue: string }
>('students/add', async (newStudent, { rejectWithValue }) => {
  try {
    const res = await instance.USER_SERVICE.post('/api/user/add-user', newStudent);
    return res.data.user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Thêm sinh viên thất bại'
    );
  }
});

// Update student information
export const setStudent = createAsyncThunk<
  UserInfo | null,
  UserInfo,
  { rejectValue: string }
>('students/set', async (updatedStudent, { rejectWithValue }) => {
  try {
    const res = await instance.USER_SERVICE.put(
      '/api/user/update-user-admin',
      updatedStudent
    );
    return res.status === 200 ? res.data.user : null;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Cập nhật sinh viên thất bại'
    );
  }
});

// Delete a student
export const deleteStudent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('students/delete', async (username, { rejectWithValue }) => {
  try {
    await instance.USER_SERVICE.delete(`/api/user/delete-user/${username}`);
    return username;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Xoá sinh viên thất bại'
    );
  }
});

// ========================
// Slice
// ========================
const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    // Set filter search term
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter.searchTerm = action.payload;
      state.filter.isServerSearch = false;
    },
    
    // Set filtered students (for client-side filtering)
    setStudentsFilters: (state, action: PayloadAction<UserInfo[]>) => {
      state.studentsFiltered = action.payload;
    },
    
    // Clear all students and reset state
    clearStudents: (state) => {
      state.students = [];
      state.studentsFiltered = [];
      state.filter = {
        searchTerm: '',
        currentPage: 1,
        isServerSearch: false
      };
      state.isLoaded = false;
      state.hasMore = true;
    },
    
    // Set loaded status
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    
    // Hydrate from persistence
    hydrate: (state, action: PayloadAction<any>) => {
      const persisted = action.payload?.students;
      if (persisted) {
        state.students = persisted.students || [];
        state.studentsFiltered = persisted.studentsFiltered || [];
        state.filter = persisted.filter || initialState.filter;
        state.isLoaded = persisted.isLoaded || false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET STUDENTS
      .addCase(getStudents.fulfilled, (state, action) => {
        const { students, hasMore, isAppend } = action.payload;
        
        if (isAppend) {
          // Append for pagination
          state.students = [...state.students, ...students];
          state.filter.currentPage += 1;
        } else {
          // Replace for new search or initial load
          state.students = students;
          state.filter.currentPage = 1;
        }
        
        state.hasMore = hasMore;
        state.loading = false;
        state.isLoaded = true;
        
        // If no client-side filter is active, update filtered list too
        if (!state.filter.searchTerm) {
          state.studentsFiltered = state.students;
        }
      })
      
      // LOAD MORE
      .addCase(loadMoreStudents.fulfilled, (state, action) => {
        const { students, hasMore } = action.payload;
        state.students = [...state.students, ...students];
        state.studentsFiltered = [...state.studentsFiltered, ...students];
        state.filter.currentPage += 1;
        state.hasMore = hasMore;
        state.loading = false;
      })
      
      // GET AVERAGE SCORE
      .addCase(getAverageScore.fulfilled, (state, action) => {
        state.averageScore = action.payload;
        state.loading = false;
      })
      
      // ADD STUDENT
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students = [action.payload, ...state.students];
        state.studentsFiltered = [action.payload, ...state.studentsFiltered];
        state.loading = false;
      })
      
      // UPDATE STUDENT
      .addCase(setStudent.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.students = state.students.map((s) =>
          s.userName === updated.userName ? updated : s
        );
        state.studentsFiltered = state.studentsFiltered.map((s) =>
          s.userName === updated.userName ? updated : s
        );
        state.loading = false;
      })
      
      // DELETE STUDENT
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const username = action.payload;
        state.students = state.students.filter((s: { userName: string; }) => s.userName !== username);
        state.studentsFiltered = state.studentsFiltered.filter((s: { userName: string; }) => s.userName !== username);
        state.loading = false;
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

// ========================
// Persist Config
// ========================
const persistConfig = {
  key: 'students',
  storage,
  blacklist: ['loading', 'error'],
};

export const persistedStudentReducer = persistReducer(persistConfig, studentSlice.reducer);

// ========================
// Export
// ========================
export const {
  clearError,
  setFilter,
  setStudentsFilters,
  clearStudents,
  setLoaded,
  hydrate,
} = studentSlice.actions;

// Selectors
export const selectStudents = (state: RootState) => state.students.students;
export const selectStudentsFiltered = (state: RootState) => state.students.studentsFiltered;
export const selectHasMore = (state: RootState) => state.students.hasMore;
export const selectStudentsLoading = (state: RootState) => state.students.loading;
export const selectStudentsError = (state: RootState) => state.students.error;
export const selectCurrentFilters = (state: RootState) => state.students.filter;
export const selectAverageScore = (state: RootState) => state.students.averageScore;
export const selectCurrentPage = (state: RootState) => state.students.filter.currentPage;

// Backward compatibility selectors
export const selectStudentsFilters = selectStudentsFiltered;

export default persistedStudentReducer;