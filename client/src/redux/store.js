import { configureStore } from "@reduxjs/toolkit";
import currentUserSlice from "@/redux/reducers/authReducer";
import likesSlice from "@/redux/reducers/user/likesReducer";
import blogPostSlice from "@/redux/reducers/user/blogPostReducer";

export const store = configureStore({
  reducer: {
    authData: currentUserSlice.reducer,
    likes: likesSlice.reducer,
    blogPosts: blogPostSlice.reducer,
  },
});
