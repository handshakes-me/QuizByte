import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/slices/userSlice'
import testSeriesReducer from '@/slices/testSeriesSlice'
import examAttemptReducer from '@/slices/examSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    testSeries: testSeriesReducer,
    examAttempt: examAttemptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
