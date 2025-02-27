import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
};

const SidebarSlice = createSlice({
  name: "Sidebar",
  initialState,
  reducers: {
    openSidebar: (state, action) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state, action) => {
      state.isSidebarOpen = false;
    },
  },
});

export const { openSidebar, closeSidebar } = SidebarSlice.actions;

export default SidebarSlice.reducer;
