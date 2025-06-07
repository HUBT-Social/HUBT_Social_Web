import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserInfo } from '../../types/User';
import { getTokensFromLocalStorage } from '../../helper/tokenHelper';
import storage from 'redux-persist/es/storage';
import { persistReducer } from 'redux-persist';
import instance from '../../config/axios';
import { AcademicStatus, AverageScore, Student } from '../../types/Student';

interface StudentState {
  loading: boolean;
  students: UserInfo[];
  filteredStudents: UserInfo[];
  mergeStudentsWithScores: Student[];
  averageScore: AverageScore[];
  isLoaded: boolean;
  error: string | null;
}

const initialState: StudentState = {
  loading: false,
  students: [],
  filteredStudents: [],
  mergeStudentsWithScores: [],
  averageScore: [],
  isLoaded: false,
  error: null,
};

interface GetUserResponse {
  aUserDTOs: UserInfo[];
  hasMore: boolean;
  message: string;
}

const calculateStatusAcademic = (gpa10: number): AcademicStatus => {
    if (gpa10 >= 9.0) return 'Excellent';
    if (gpa10 >= 8.0) return 'VeryGood';
    if (gpa10 >= 7.0) return 'Good';
    if (gpa10 >= 6.5) return 'FairlyGood';
    if (gpa10 >= 5.0) return 'Average';
    return 'Warning'; // Anything below 4.0 is Poor; MustDropOut may be set by other logic
};
const calculateFaculty = (className: string | null): string => {
    if (!className) return 'N/A';
      const match = className.match(/^[A-Za-z]+/);
      return match ? match[0] : 'N/A';
    };
const calculateCourse = (className: string | null): string => {
    if (!className) return 'N/A';
      const match = className.match(/\d+/);
      return match ? match[0] : 'N/A';
    };

const mapToStudents = (userInfos: UserInfo[], averageScores: AverageScore[]): Student[] => {
  // Tạo Map từ userName đến AverageScore
  const scoreMap = new Map<string, AverageScore>(
    averageScores.map((score) => [score.maSV, score])
  );

  // Map userInfos thành Students và lọc bỏ null
  return userInfos
    .map((userInfo) => {
      const averageScore = scoreMap.get(userInfo.userName);
      if (!averageScore) return null; // Bỏ qua nếu không tìm thấy AverageScore
      return {
        ...userInfo,
        ...averageScore,
        faculty: calculateFaculty(userInfo.className),
        course: calculateCourse(userInfo.className),
        academicStatus: calculateStatusAcademic(averageScore.diemTB10),
        subjects: [], // Optional, có thể thêm dữ liệu nếu có
      };
    })
    .filter((student) => student !== null); // Lọc bỏ các null
};

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
    const res = await instance.USER_SERVICE.get(`/api/user/get-user-by-role?roleName=USER&page=${page}`);
    return res;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || 'Không thể tải danh sách sinh viên'
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
      scores.push(...currentScores); // ✅ nhanh hơn [...scores, ...]
      console.log('Srcore: ',scores.length);
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
    const token = getTokensFromLocalStorage();
    if (!token) return rejectWithValue('Không tìm thấy token xác thực');

    const res = await instance.USER_SERVICE.post('/api/user/add-user',newStudent);
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

    const res = await instance.USER_SERVICE.put('api/user/update-user-admin',updatedStudent);
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
    setStudents: (state, action: PayloadAction<UserInfo[]>) => {
      state.students = action.payload;
      state.mergeStudentsWithScores = [];
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
          usersReceived: action.payload.aUserDTOs.length,
          currentStudentsCount: state.students.length,
        });

        const newStudents = action.payload.aUserDTOs.filter(
          (user) => !state.students.some((s) => s.userName === user.userName)
        );
        state.students = [...state.students, ...newStudents];
        state.filteredStudents = [...state.filteredStudents, ...newStudents];
        state.loading = false;
        state.isLoaded = true;
      })
      
  .addCase(getAverageScore.fulfilled, (state, action: PayloadAction<AverageScore[]>) => {
    state.loading = false;
    console.log('Score count:', action.payload.length);
    state.mergeStudentsWithScores = mapToStudents(state.students,action.payload);
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
export const selectMergeStudentsWithScores = (state: RootState) => state.students.mergeStudentsWithScores;

export default persistedTeacherReducer;