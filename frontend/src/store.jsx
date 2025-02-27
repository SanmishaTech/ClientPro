import { configureStore } from "@reduxjs/toolkit";
import SidebarReducer from "./features/SidebarSlice/SidebarSlice";
export const store = configureStore({
  reducer: {
    Sidebar: SidebarReducer,
  },
});
