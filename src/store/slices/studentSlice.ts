import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import axios from 'axios';

import { RootState } from '../store';
import { UserInfo } from '../../types/User';

interface StudentState {
  loading: boolean;
  students: UserInfo[];
  filteredStudents: UserInfo[];
  isLoaded: boolean;
  error: string | null;
}

const initialState: StudentState = {
  loading: false,
  students: [],
  filteredStudents: [],
  isLoaded: false,
  error: null,
};

// Lấy danh sách sinh viên
export const getStudents = createAsyncThunk<
  { users: UserInfo[]; hasMore: boolean; message: string },
  number,
  { rejectValue: string }
>('students/get', async (page, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `https://localhost:7223/api/user/get-user-by-role?roleName=USER&page=${page}`
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Không thể tải danh sách sinh viên');
  }
});

// Thêm sinh viên
export const addStudent = createAsyncThunk<
  UserInfo,
  UserInfo,
  { rejectValue: string }
>('students/add', async (newStudent, { rejectWithValue }) => {
  try {
    return newStudent;
  } catch {
    return rejectWithValue('Thêm sinh viên thất bại!');
  }
});

// Cập nhật sinh viên
export const setStudent = createAsyncThunk<
  UserInfo,
  UserInfo,
  { rejectValue: string }
>('students/set', async (updatedStudent, { rejectWithValue }) => {
  try {
    return updatedStudent;
  } catch {
    return rejectWithValue('Cập nhật sinh viên thất bại!');
  }
});

// Xoá sinh viên
export const deleteStudent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('students/delete', async (username, { rejectWithValue }) => {
  try {
    return username;
  } catch {
    return rejectWithValue('Xoá sinh viên thất bại!');
  }
});

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStudents: (state, action: PayloadAction<UserInfo[]>) => {
      state.students = action.payload;
    },
    setFilteredStudents: (state, action: PayloadAction<UserInfo[]>) => {
      state.filteredStudents = action.payload;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    hydrate: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.fulfilled, (state, action) => {
        state.students.push(...action.payload.users);
        state.filteredStudents.push(...action.payload.users);
        state.loading = false;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.filteredStudents.push(action.payload);
        state.loading = false;
      })
      .addCase(setStudent.fulfilled, (state, action) => {
        const update = (list: UserInfo[]) => {
          const index = list.findIndex(s => s.userName === action.payload.userName);
          if (index !== -1) list[index] = action.payload;
        };
        update(state.students);
        update(state.filteredStudents);
        state.loading = false;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const remove = (list: UserInfo[]) =>
          list.filter(s => s.userName !== action.payload);
        state.students = remove(state.students);
        state.filteredStudents = remove(state.filteredStudents);
        state.loading = false;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        const payload = (action as PayloadAction<string>).payload;
        state.error = payload || action.error?.message || 'Lỗi không xác định';
      });
  },
});

// Actions
export const {
  clearError,
  setStudents,
  setFilteredStudents,
  setIsLoaded,
  hydrate,
} = studentSlice.actions;

// Selectors
export const selectStudents = (state: RootState) => state.students.students;
export const selectStudentsFiltered = (state: RootState) => state.students.filteredStudents;
export const selectIsLoaded = (state: RootState) => state.students.isLoaded;
export const selectStudentsLoading = (state: RootState) => state.students.loading;
export const selectStudentsError = (state: RootState) => state.students.error;

// Persist cấu hình
const persistConfig = {
  key: 'students',
  storage,
  whitelist: ['students', 'filteredStudents'],
};

export default persistReducer(persistConfig, studentSlice.reducer);
