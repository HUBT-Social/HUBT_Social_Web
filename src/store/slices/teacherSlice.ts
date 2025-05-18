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

// Interface cho trạng thái
interface TeacherState {
  loading: boolean;
  teachers: UserInfo[];
  filteredTeachers: UserInfo[];
  isLoaded: boolean;
  error: string | null;
}

// Trạng thái ban đầu
const initialState: TeacherState = {
  loading: false,
  teachers: [],
  filteredTeachers: [],
  isLoaded: false,
  error: null,
};

// Thunk: Lấy danh sách giáo viên theo trang
export const getTeachers = createAsyncThunk<
  { users: UserInfo[]; hasMore: boolean; message: string },
  number,
  { rejectValue: string }
>('teachers/get', async (page, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `https://localhost:7223/api/user/get-user-by-role?roleName=TEACHER&page=${page}`
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.message || 'Không thể tải danh sách giáo viên'
    );
  }
});

// Thunk: Thêm giáo viên
export const addTeacher = createAsyncThunk<
  UserInfo,
  UserInfo,
  { rejectValue: string }
>('teachers/add', async (newTeacher, { rejectWithValue }) => {
  try {
    return newTeacher;
  } catch (error: any) {
    return rejectWithValue('Thêm giáo viên thất bại!');
  }
});

// Thunk: Cập nhật giáo viên
export const setTeacher = createAsyncThunk<
  UserInfo | null,
  UserInfo,
  { rejectValue: string }
>('teachers/set', async (updatedTeacher, { rejectWithValue }) => {
  try {
    const token = getTokensFromLocalStorage();
    if (!token) return null;

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

    return res.status === 200 ? updatedTeacher : null;
  } catch (error: any) {
    return rejectWithValue('Cập nhật thông tin thất bại!');
  }
});

// Thunk: Xoá giáo viên
export const deleteTeacher = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('teachers/delete', async (username, { rejectWithValue }) => {
  try {
    return username;
  } catch (error: any) {
    return rejectWithValue('Xoá giáo viên thất bại!');
  }
});

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
    setFilteredTeachers(state, action: PayloadAction<UserInfo[]>) {
      state.filteredTeachers = action.payload;
    },
    setIsLoaded(state, action: PayloadAction<boolean>) {
      state.isLoaded = action.payload;
    },
    hydrate(state, action: PayloadAction<any>) {
      const persisted = action.payload?.teachers;
      if (persisted) {
        state.teachers = persisted;
        state.filteredTeachers = persisted;
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
      .addCase(getTeachers.fulfilled, (state, action) => {
        const { users } = action.payload;

        if (users.length === 0) {
          state.loading = false;
          return;
        }

        // Nếu là page đầu tiên => reset
        if (state.teachers.length === 0) {
          state.teachers = users;
          state.filteredTeachers = users;
        } else {
          // Chỉ thêm nếu chưa có
          users.forEach((user) => {
            const exists = state.teachers.some(
              (t) => t.userName === user.userName
            );
            if (!exists) {
              state.teachers.push(user);
              state.filteredTeachers.push(user);
            }
          });
        }

        state.loading = false;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
        state.filteredTeachers.push(action.payload);
        state.loading = false;
      })
      .addCase(setTeacher.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        const updateList = (list: UserInfo[]) => {
          const index = list.findIndex((u) => u.userName === updated.userName);
          if (index !== -1) list[index] = updated;
        };

        updateList(state.teachers);
        updateList(state.filteredTeachers);
        state.loading = false;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        const username = action.payload;
        state.teachers = state.teachers.filter((t) => t.userName !== username);
        state.filteredTeachers = state.filteredTeachers.filter(
          (f) => f.userName !== username
        );
        state.loading = false;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        const payload = (action as PayloadAction<string>).payload;
        state.error = payload || action.error.message || 'Lỗi không xác định';
      });
  },
});

// Export actions
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
export const selectTeachersFiltered = (state: RootState) =>
  state.teachers.filteredTeachers;
export const selectIsLoaded = (state: RootState) => state.teachers.isLoaded;
export const selectTeachersLoading = (state: RootState) =>
  state.teachers.loading;
export const selectTeachersError = (state: RootState) => state.teachers.error;

// Persist config
const persistConfig = {
  key: 'teachers',
  storage: storage,
  whitelist: ['teachers', 'filteredTeachers'],
};

const persistedReducer = persistReducer(persistConfig, teacherSlice.reducer);
export default persistedReducer;
