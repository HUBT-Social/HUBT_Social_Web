import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { Action, combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // Chọn localStorage cho web
import authUserReducer from './slices/authSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import notificationReducer from './slices/notificationSlice';
import examReducer from './slices/examSlice';
import settingReducer from './slices/settingSlice';

// Kết hợp các reducer
const rootReducer = combineReducers({
  authUser: authUserReducer,
  teachers: teacherReducer,
  students: studentReducer,
  notification: notificationReducer,
  exams: examReducer,
  settings: settingReducer
  // Thêm các reducer khác nếu bạn có
});

// Cấu hình Redux Persist
const persistConfig = {
  key: 'root', // Key cho toàn bộ store
  storage: storage, // Chọn storage engine (localStorage cho web)
  version: 1, // Phiên bản của schema persisted. Tăng lên nếu bạn thay đổi cấu trúc.
  // Các reducer đã được cấu hình persist trong các file slice riêng biệt.
  middleware: (getDefaultMiddleware: (arg0: { serializableCheck: { ignoredActions: ("persist/FLUSH" | "persist/REHYDRATE" | "persist/PAUSE" | "persist/PERSIST" | "persist/PURGE" | "persist/REGISTER")[]; }; }) => any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Bỏ qua các action không tuần tự
      },
    }),
};

// Tạo persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store
const store = configureStore({
  reducer: persistedReducer, // Sử dụng persistedReducer thay vì rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Bỏ qua các action không tuần tự
      },
    }),
});

// Tạo persistor để theo dõi state đã persisted
const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Export cả store và persistor
export { store, persistor };
