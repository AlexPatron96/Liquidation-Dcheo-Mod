import { createSlice } from '@reduxjs/toolkit';

// Cambiamos mySlice por el nombre de nuestro slice (usersSlice, toDosSlice...)
export const paginationSlices = createSlice({
  name: 'pagination',
  initialState: [],
  reducers: {
    setPagination: (state, action) => {
      return action.payload;
    }
  }
})

export const { setPagination } = paginationSlices.actions;

export default paginationSlices.reducer;
