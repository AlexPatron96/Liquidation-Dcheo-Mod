import { createSlice } from '@reduxjs/toolkit';

export const closeoutsSlice = createSlice({
    name: 'clouseouts',
    initialState: [],
    reducers: {
        setCloseouts: (state,action) => {
            return action.payload
        }
    }
})

export const { setCloseouts } = closeoutsSlice.actions;

export default closeoutsSlice.reducer;
