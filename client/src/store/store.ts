import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth.slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
