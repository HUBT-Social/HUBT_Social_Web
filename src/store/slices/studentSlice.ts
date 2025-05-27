import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { UserInfo } from '../../types/User';
import { getTokensFromLocalStorage } from '../../helper/tokenHelper';
import storage from 'redux-persist/es/storage';
import { persistReducer } from 'redux-persist';

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

interface GetUserResponse {
  users: UserInfo[];
  hasMore: boolean;
  message: string;
}

// ========================
// Async Thunks
// ========================

// Fetch students by page
export const getStudents = createAsyncThunk<
  GetUserResponse,
  number,
  { rejectValue: string }
>('students/get', async (page, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `https://localhost:7223/api/user/get-user-by-role?roleName=USER&page=${page}`
    );
    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Không thể tải danh sách sinh viên'
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
    const token = getTokensFromLocalStorage();
    if (!token) return rejectWithValue('Không tìm thấy token xác thực');

    const res = await axios.post(
      'https://localhost:7223/api/user/add-user',
      newStudent,
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
    const token = getTokensFromLocalStorage();
    if (!token) return rejectWithValue('Không tìm thấy token xác thực');

    const res = await axios.put(
      'https://localhost:7223/api/user/update-user-admin',
      updatedStudent,
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
    setStudents: (state, action: PayloadAction<UserInfo[]>) => {
      state.students = action.payload;
      state.filteredStudents = action.payload;
    },
    setFilteredStudents: (state, action: PayloadAction<UserInfo[]>) => {
      state.filteredStudents = action.payload;
    },
    setIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    hydrate: (state, action: PayloadAction<any>) => {
      const persisted = action.payload?.students;
      if (persisted) {
        state.students = persisted.students || [];
        state.filteredStudents = persisted.filteredStudents || [];
        state.isLoaded = persisted.isLoaded || false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getStudents.fulfilled, (state, action: PayloadAction<GetUserResponse>) => {
        console.log('Fetched students:', {
          usersReceived: action.payload.users.length,
          currentStudentsCount: state.students.length,
        });

        const newStudents = action.payload.users.filter(
          (user) => !state.students.some((s) => s.userName === user.userName)
        );
        state.students = [...state.students, ...newStudents];
        state.filteredStudents = [...state.filteredStudents, ...newStudents];
        state.loading = false;
        state.isLoaded = true;
      })
      // ADD
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students = [...state.students, action.payload];
        state.filteredStudents = [...state.filteredStudents, action.payload];
        state.loading = false;
      })
      // UPDATE
      .addCase(setStudent.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;

        state.students = state.students.map((s) =>
          s.userName === updated.userName ? updated : s
        );
        state.filteredStudents = state.filteredStudents.map((s) =>
          s.userName === updated.userName ? updated : s
        );
        state.loading = false;
      })
      // DELETE
      .addCase(deleteStudent.fulfilled, (state, action) => {
        const username = action.payload;
        state.students = state.students.filter((s) => s.userName !== username);
        state.filteredStudents = state.filteredStudents.filter(
          (s) => s.userName !== username
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
  key: 'students',
  storage,
};

export const persistedTeacherReducer = persistReducer(persistConfig, studentSlice.reducer);


// ========================
// Export
// ========================
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

export default persistedTeacherReducer;