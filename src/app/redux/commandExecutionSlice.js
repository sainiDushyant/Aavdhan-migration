import { createSlice } from '@reduxjs/toolkit';

// Initial State
const initialAssetsState = {
  responseData: { pss_list: [], feeder_list: [], dtr_list: [] },
};

const initialDlmsState = {
  responseData: [],
};

const initialModuleState = '';

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

const currentSelectedModuleSlice = createSlice({
  name: 'currentSelectedModule',
  initialState: initialModuleState,
  reducers: {
    setCurrentSelectedModule(state, action) {
      return action.payload;
    },
  },
});

// Actions
export const { setMDASAssetList } = utilityMDASAssetListSlice.actions;
export const { setMDASDlmsCommandList } = utilityMDASDlmsCommandSlice.actions;
export const { setCurrentSelectedModule } = currentSelectedModuleSlice.actions;

// Export reducers
export const utilityMDASAssetListReducer = utilityMDASAssetListSlice.reducer;
export const utilityMDASDlmsCommandReducer =
  utilityMDASDlmsCommandSlice.reducer;
export const currentSelectedModuleReducer = currentSelectedModuleSlice.reducer;
