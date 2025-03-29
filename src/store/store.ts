import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authUserSlice from './slices/authSlice';
import teacherReducer from './slices/teacherSlice';
export const store = configureStore({
  reducer: {
    authUser: authUserSlice,
    teachers: teacherReducer,
    // Add other reducers here if you have them
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;