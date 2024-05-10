import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialState = {
  responseData: { pss_list: [], feeder_list: [], dtr_list: [] },
};

// Slice
const utilityMDASAssetListSlice = createSlice({
  name: 'utilityMDASAssetList',
  initialState,
  reducers: {
    setMDASAssetList(state, action) {
      const { assets } = action.payload;
      state.responseData = assets;
    },
  },
});

// Actions
export const { setMDASAssetList } = utilityMDASAssetListSlice.actions;

// Reducer
export default utilityMDASAssetListSlice.reducer;
