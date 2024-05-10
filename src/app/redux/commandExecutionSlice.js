import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialAssetsState = {
  responseData: { pss_list: [], feeder_list: [], dtr_list: [] },
};

const initialDlmsState = {
  responseData: [],
};

// Slice
const utilityMDASAssetListSlice = createSlice({
  name: 'utilityMDASAssetList',
  initialState: initialAssetsState,
  reducers: {
    setMDASAssetList(state, action) {
      const assets = action.payload;
      state.responseData = assets;
    },
  },
});

const utilityMDASDlmsCommandSlice = createSlice({
  name: 'utilityMDASDlmsCommand',
  initialState: initialDlmsState,
  reducers: {
    setMDASDlmsCommandList(state, action) {
      const data = action.payload;
      state.responseData = data;
    },
  },
});

// Actions
export const { setMDASAssetList } = utilityMDASAssetListSlice.actions;
export const { setMDASDlmsCommandList } = utilityMDASDlmsCommandSlice.actions;

// Export reducers
export const utilityMDASAssetListReducer = utilityMDASAssetListSlice.reducer;
export const utilityMDASDlmsCommandReducer =
  utilityMDASDlmsCommandSlice.reducer;
