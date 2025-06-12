import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { RootState } from '../store';
import instance from '../../config/axios';
import { UserInfo } from '../../types/userInfo';

// Interface for filters
interface FilterParams {
  faculty?: string[];
  khoa?: string[];
  class?: string[];
  gender?: number[];
  status?: string[];
}


// Interface for state
interface TeacherState {
  loading: boolean;
  teachers: UserInfo[];
  error: string | null;
  filters: FilterParams;
  isLoaded: boolean;
  currentPage: number;
  hasMore:  boolean;
}

// Initial state
const initialState: TeacherState = {
  loading: false,
  teachers: [],
  error: null,
  filters: {},
  isLoaded: false,
  currentPage: 1,
  hasMore: true
};

// Interface for API params
interface GetTeachersParams {
  page: number;
  pageSize?: number;
  faculty?: string[];
  khoa?: string[];
  class?: string[];
  gender?: number[];
  status?: string[];
}

// Interface for API response
interface GetTeachersResponse {
  aUserDTOs: UserInfo[];
  hasMore: boolean;
  message: string;
}

// ========================
// Async Thunks
// ========================

// Fetch teachers with pagination and filters
export const getTeachers = createAsyncThunk<
  {response: GetTeachersResponse, isAppend: boolean},
  {params: GetTeachersParams, currentFilter: FilterParams},
  { rejectValue: string }
>('teachers/get', async ({ params, currentFilter }, { rejectWithValue}) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('roleName', 'TEACHER');
    let isAppend = true;

    if( currentFilter.class !== params.class || 
        currentFilter.faculty !== params.faculty ||
        currentFilter.gender !== params.gender ||
        currentFilter.khoa !== params.khoa 
    ){
      queryParams.append('page', '1');
      isAppend = false;
    }else{
      queryParams.append('page', params.page.toString());
    }
    

    // Add filters
    if (params.faculty?.length) {
      params.faculty.forEach(f => queryParams.append('faculty', f));
    }
    if (params.khoa?.length) {
      params.khoa.forEach(k => queryParams.append('khoa', k));
    }
    if (params?.class?.length) {
      params.class.forEach(c => queryParams.append('class', c));
    }
    if (params.gender?.length) {
      params.gender.forEach(g => queryParams.append('gender', g.toString()));
    }
    if (params.status?.length) {
      params.status.forEach(s => queryParams.append('status', s));
    }


    const res = await instance.USER_SERVICE.get(`/api/user/get-user-by-role?${queryParams.toString()}`);
    
    console.log("Teachers loaded:", res.aUserDTOs.length);
    
    // Return with pagination info
    return { response: {
      aUserDTOs: res.aUserDTOs || [],
      hasMore: res.hasMore || false,
      message: res.message || '',
    } as GetTeachersResponse,
    isAppend: isAppend};
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Không thể tải danh sách giáo viên'
    );
  }
});


// Add a new teacher
export const addTeacher = createAsyncThunk<UserInfo, UserInfo, { rejectValue: string }>(
  'teachers/add',
  async (newTeacher, { rejectWithValue }) => {
    try {
      const res = await instance.USER_SERVICE.post('/api/user/add-user', newTeacher);
      return res.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Thêm giáo viên thất bại'
      );
    }
  }
);

// Update teacher information
export const setTeacher = createAsyncThunk<UserInfo | null, UserInfo, { rejectValue: string }>(
  'teachers/set',
  async (updatedTeacher, { rejectWithValue }) => {
    try {
      const res = await instance.USER_SERVICE.put('/api/user/update-user-admin', updatedTeacher);
      return res;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại'
      );
    }
  }
);

// Delete a teacher
export const deleteTeacher = createAsyncThunk<string, string, { rejectValue: string }>(
  'teachers/delete',
  async (username, { rejectWithValue }) => {
    try {
      await instance.USER_SERVICE.delete(`/api/user/delete-user/${username}`);
      return username;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Xoá giáo viên thất bại'
      );
    }
  }
);

// ========================
// Slice
// ========================
const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setTeachers(state, action: PayloadAction<UserInfo[]>) {
      state.teachers = action.payload;
    },
    setTeachersFilters(state, action: PayloadAction<FilterParams>) {
      state.filters = action.payload;
    },
    clearTeachers(state) {
      state.teachers = [];
      state.filters = {};
      state.isLoaded = false;
    },
    hydrate(state, action: PayloadAction<any>) {
      const persisted = action.payload?.teachers;
      if (persisted) {
        state.teachers = persisted.teachers || [];
        state.filters = persisted.filters || {};
      }
    },
    setLoaded(state, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET with pagination
      .addCase(getTeachers.fulfilled, (state, action: PayloadAction<{response: GetTeachersResponse, isAppend: boolean}>) => {
        console.log('Fetched teachers:', {
          usersReceived: action.payload.response.aUserDTOs.length,
        });
        if(action.payload.isAppend){
          state.teachers = [...state.teachers,...action.payload.response.aUserDTOs];
        }else{
          state.teachers = action.payload.response.aUserDTOs;
        }
        state.loading = false;
      })
      // ADD
      .addCase(addTeacher.fulfilled, (state, action) => {
        // Add to current page if there's space, otherwise just update total
        if (state.teachers.length) {
          state.teachers = [...state.teachers, action.payload];
        }
        state.loading = false;
      })
      // UPDATE
      .addCase(setTeacher.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.teachers = state.teachers.map((t) =>
          t.userName === updated.userName ? updated : t
        );
        state.loading = false;
      })
      // DELETE
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        const username = action.payload;
        state.teachers = state.teachers.filter((user) => user.userName !== username);
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
  key: 'teachers',
  storage,
  // Don't persist loading state
  blacklist: ['loading', 'error'],
};

export const persistedTeacherReducer = persistReducer(persistConfig, teacherSlice.reducer);

// ========================
// Export Actions
// ========================
export const {
  clearError,
  setTeachers,
  setTeachersFilters,
  clearTeachers,
  hydrate,
  setLoaded 
} = teacherSlice.actions;

// ========================
// Selectors
// ========================
export const selectTeachers = (state: RootState) => state.teachers.teachers;
export const selectHasMore = (state: RootState) => state.teachers.hasMore;
export const selectTeachersLoading = (state: RootState) => state.teachers.loading;
export const selectTeachersError = (state: RootState) => state.teachers.error;
export const selectTeachersFilters = (state: RootState) => state.teachers.filters;
export const selectCurrentPage = (state: RootState) => state.teachers.currentPage;

export default persistedTeacherReducer;