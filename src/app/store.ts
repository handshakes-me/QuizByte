import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/slices/userSlice'
import testSeriesReducer from '@/slices/testSeriesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    testSeries: testSeriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
