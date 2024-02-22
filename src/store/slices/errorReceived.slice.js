import { createSlice } from '@reduxjs/toolkit';

export const errorReceivedSlice = createSlice({
    name: 'errorReceived',
    initialState: [],
    reducers: {
        setErrorReceived: (state, action) => {
            return action.payload;
        }
    }
})

export const {setErrorReceived } = errorReceivedSlice.actions;

export default errorReceivedSlice.reducer;
