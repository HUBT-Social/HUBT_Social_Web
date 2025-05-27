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
import { UserInfo } from '../../types/User';
import axios from 'axios';
import { getTokensFromLocalStorage } from '../../helper/tokenHelper';

// Interface for state
interface TeacherState {
  loading: boolean;
  teachers: UserInfo[];
  filteredTeachers: UserInfo[];
  isLoaded: boolean;
  error: string | null;
}

// Initial state
const initialState: TeacherState = {
  loading: false,
  teachers: [],
  filteredTeachers: [],
  isLoaded: false,
  error: null,
};

interface GetUserResponse {
  users: UserInfo[];
  hasMore: boolean;
  message: string;
}

// ========================
// Async Thunks
// ========================

// Fetch teachers by page
export const getTeachers = createAsyncThunk<
  GetUserResponse,
  number,
  { rejectValue: string }
>('teachers/get', async (page, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `https://localhost:7223/api/user/get-user-by-role?roleName=TEACHER&page=${page}`
    );
    console.log("User: ", res.data.users.length);
    return res.data;
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
      const token = getTokensFromLocalStorage();
      if (!token) return rejectWithValue('Không tìm thấy token xác thực');

      const res = await axios.post(
        'https://localhost:7223/api/user/add-user',
        newTeacher,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data.user;
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
      const token = getTokensFromLocalStorage();
      if (!token) return rejectWithValue('Không tìm thấy token xác thực');

      const res = await axios.put(
        'https://localhost:7223/api/user/update-user-admin',
        updatedTeacher,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.status === 200 ? res.data.user : null;
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
      const token = getTokensFromLocalStorage();
      if (!token) return rejectWithValue('Không tìm thấy token xác thực');

      await axios.delete(`https://localhost:7223/api/user/delete-user/${username}`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
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
      state.filteredTeachers = action.payload;
    },
    setFilteredTeachers(state, action: PayloadAction<UserInfo[]>) {
      state.filteredTeachers = action.payload;
    },
    setIsLoaded(state, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
    hydrate(state, action: PayloadAction<any>) {
      const persisted = action.payload?.teachers;
      if (persisted) {
        state.teachers = persisted.teachers || [];
        state.filteredTeachers = persisted.filteredTeachers || [];
        state.isLoaded = persisted.isLoaded || false;
      }
    },
    clearTeachers(state) {
      state.teachers = [];
      state.filteredTeachers = [];
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getTeachers.fulfilled, (state, action: PayloadAction<GetUserResponse>) => {
        console.log('Fetched teachers:', {
          usersReceived: action.payload.users.length,
          currentTeachersCount: state.teachers.length,
        });

        const newTeachers = action.payload.users.filter(
          (user) => !state.teachers.some((t) => t.userName === user.userName)
        );
        state.teachers = [...state.teachers, ...newTeachers];
        state.filteredTeachers = [...state.filteredTeachers, ...newTeachers];
        state.loading = false;
        state.isLoaded = true;
      })
      // ADD
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.teachers = [...state.teachers, action.payload];
        state.filteredTeachers = [...state.filteredTeachers, action.payload];
        state.loading = false;
      })
      // UPDATE
      .addCase(setTeacher.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.teachers = state.teachers.map((t) =>
          t.userName === updated.userName ? updated : t
        );
        state.filteredTeachers = state.filteredTeachers.map((t) =>
          t.userName === updated.userName ? updated : t
        );
        state.loading = false;
      })
      // DELETE
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        const username = action.payload;
        state.teachers = state.teachers.filter((user) => user.userName !== username);
        state.filteredTeachers = state.filteredTeachers.filter(
          (user) => user.userName !== username
        );
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
};

export const persistedTeacherReducer = persistReducer(persistConfig, teacherSlice.reducer);

// ========================
// Export
// ========================
export const {
  clearError,
  setFilteredTeachers,
  setTeachers,
  hydrate,
  setIsLoaded,
  clearTeachers,
} = teacherSlice.actions;

// Selectors
export const selectTeachers = (state: RootState) => state.teachers.teachers;
export const selectTeachersFiltered = (state: RootState) => state.teachers.filteredTeachers;
export const selectIsLoaded = (state: RootState) => state.teachers.isLoaded;
export const selectTeachersLoading = (state: RootState) => state.teachers.loading;
export const selectTeachersError = (state: RootState) => state.teachers.error;

export default persistedTeacherReducer;