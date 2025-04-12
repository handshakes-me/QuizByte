import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    organizationId?: string;
};

type UserState = {
    user: User | null;
};

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        clearUser(state) {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;