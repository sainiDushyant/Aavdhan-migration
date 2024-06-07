import { createSlice } from '@reduxjs/toolkit';

const initialModuleState = '';

const currentSelectedModuleSlice = createSlice({
  name: 'currentSelectedModule',
  initialState: initialModuleState,
  reducers: {
    setCurrentSelectedModule(state, action) {
      return action.payload || state;
    },
  },
});

// Actions
export const { setCurrentSelectedModule } = currentSelectedModuleSlice.actions;
export const currentSelectedModuleReducer = currentSelectedModuleSlice.reducer;
