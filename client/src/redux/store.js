import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "@/redux/reducers/authReducer";

export const store = configureStore({
  reducer: { authData: currentUserSlice.reducer },
});
