import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapsed: false,
  isMobileSidebarOpen: false,
};
const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    setIsMobileSidebarOpen: (state, action) => {
      state.isMobileSidebarOpen = action.payload;
    },
  },
});

export const { setCollapsed, setIsMobileSidebarOpen } = layoutSlice.actions;
export default layoutSlice.reducer;
