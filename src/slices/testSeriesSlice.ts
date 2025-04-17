import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the TestSeries type
export type TestSeries = {
    _id: string;
    name: string;
    description: string;
    exams?: any[];
    organizationId: string;
    status: string;
    students?: any[];
    subjects?: any[];
};

type TestSeriesState = {
    testSeries: TestSeries[];
};

const initialState: TestSeriesState = {
    testSeries: [],
};

// Create the test series slice
const testSeriesSlice = createSlice({
    name: 'testSeries',
    initialState,
    reducers: {
        setTestSeries(state, action: PayloadAction<TestSeries[]>) {
            state.testSeries = action.payload;
        },
    },
});

// Export actions and reducer
export const { setTestSeries } = testSeriesSlice.actions;
export default testSeriesSlice.reducer;
