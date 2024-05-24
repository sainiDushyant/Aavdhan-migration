import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {},
};

const MDMSHierarchyProgress = createSlice({
  name: 'MDMSHierarchyProgress',
  initialState,
  reducers: {
    updateMDMSHierarchyProgress(state, action) {
      state.data = action.payload;
    },
  },
});

export const { updateMDMSHierarchyProgress } = MDMSHierarchyProgress.actions;
export const MDMSHierarchyProgressReducer = MDMSHierarchyProgress.reducer;
