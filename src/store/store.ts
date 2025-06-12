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
import storage from 'redux-persist/lib/storage';
import authUserReducer from './slices/authSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import notificationReducer from './slices/notificationSlice';
import examReducer from './slices/examSlice';
import settingReducer from './slices/settingSlice';
import scheduleReducer from './slices/scheduleSlice';

const rootReducer = combineReducers({
  authUser: authUserReducer,
  teachers: teacherReducer,
  students: studentReducer,
  notification: notificationReducer,
  exams: examReducer,
  settings: settingReducer,
  schedule: scheduleReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  whitelist: [ 'authUser'], //'students', 'teachers',
  transforms: [
    {
      in: (state: any) => state,
      out: (state: any) => ({
        ...state,
        _persistTimestamp: Date.now(),
      }),
    },
  ],
};

const ttlMiddleware = () => (next: any) => (action: any) => {
  if (action.type === REHYDRATE && action.payload) {
    const { _persistTimestamp } = action.payload;
    if (_persistTimestamp && Date.now() - _persistTimestamp > 3600000) {
      return next({ type: PURGE, key: persistConfig.key, result: () => null });
    }
  }
  return next(action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(ttlMiddleware),
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { store, persistor };