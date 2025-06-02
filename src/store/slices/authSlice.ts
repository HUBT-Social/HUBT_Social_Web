import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import instance from '../../config/axios';
import { RootState } from '../store';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '../../services/endpoints';
import { handleLoginSuccess, handleLogout } from '../../helper/tokenHelper';
import { LoginResponse, UserToken } from '../../types/User';

// ----------------------------
// Interfaces
// ----------------------------

export interface UserState {
  avatarUrl: string;
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  birthDay: string;
  phoneNumber: string;
}


interface AuthState {
  loading: boolean;
  token: UserToken | null;
  isAuthenticated: boolean;
  user: LoginResponse | null;
  userInfo: UserState | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// ----------------------------
// Initial State
// ----------------------------

const initialState: AuthState = {
  loading: false,
  token: null,
  isAuthenticated: false,
  user: null,
  userInfo: null,
  status: 'idle',
  error: null,
};

// ----------------------------
// Async Thunks
// ----------------------------

export const loginRequest = createAsyncThunk<
  LoginResponse,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await instance.withoutAuth().post(AUTH_ENDPOINTS.POST_SIGN_IN, JSON.stringify(credentials));
    return response.data as LoginResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    return rejectWithValue(errorMessage);
  }
});

export const getInfoUser = createAsyncThunk<
  UserState,
  { accessToken: string },
  { rejectValue: string }
>('auth/getInfoUser', async ({ }, { rejectWithValue }) => {
  try {
    // const response = await instance.get<UserState>(USER_ENDPOINTS.GET_USER, {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    const response = await instance.get<UserState>(USER_ENDPOINTS.GET_USER);
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Lỗi khi lấy thông tin người dùng';
    return rejectWithValue(errorMessage);
  }
});
// Thunk để cập nhật thông tin người dùng
export const updateUserProfile = createAsyncThunk<
  any,
  { name: string; email: string },
  { rejectValue: string }
>(
  'user/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await instance.put('/user/profile', profileData);
      return response.data as any;
    } catch (error: any) {
      let errorMessage = 'Đã có lỗi xảy ra khi cập nhật thông tin người dùng';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


// ----------------------------
// Slice
// ----------------------------

const authSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.userInfo = null;
      state.error = null;
      state.token = null;
      handleLogout();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginRequest.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        handleLoginSuccess(action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.userToken;
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Lỗi không xác định';
        state.isAuthenticated = false;
        state.user = null;
      });

    // getInfoUser
    builder
      .addCase(getInfoUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getInfoUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(getInfoUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Không thể lấy thông tin người dùng';
      });
  },
});

// ----------------------------
// Persist Config
// ----------------------------

const persistConfig = {
  key: 'authUser',
  storage,
  whitelist: ['token', 'isAuthenticated', 'user'],
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// ----------------------------
// Export
// ----------------------------

export const { logout, clearError } = authSlice.actions;
export default persistedReducer;

// ----------------------------
// Selectors
// ----------------------------

export const selectAuthLoading = (state: RootState) => state.authUser.loading;
export const selectAuthError = (state: RootState) => state.authUser.error;
export const selectIsAuthenticated = (state: RootState) => state.authUser.isAuthenticated;
export const selectUser = (state: RootState) => state.authUser.user;
export const selectUserInfo = (state: RootState) => state.authUser.userInfo;
export const selectUserInfoStatus = (state: RootState) => state.authUser.status;
export const selectToken = (state: RootState) => state.authUser.token;
