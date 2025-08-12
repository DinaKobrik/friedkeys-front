import { configureStore } from "@reduxjs/toolkit";
import setupReducer from "./features/setup/setupSlice";

export const store = configureStore({
  reducer: {
    setup: setupReducer,
  },
});

// Эти строки нужны для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
