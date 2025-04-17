import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const dev = process.env.NODE_ENV != "production";

import { Cookies } from "react-cookie";

export const fetchBlogPosts = createAsyncThunk("blogPost", async (values) => {
  try {
    const cookies = new Cookies();
    const cookieData = await cookies.getAll();

    console.log("cookieData", cookieData.userToken);

    const res = await axios.post(`/api/v1/user/get/blog`, values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    console.log("==== BLOG POSTS ==== \n res:", res.data);
    return res?.data?.data;
  } catch (error) {
    throw { error: error.message };
  }
});

const blogPostSlice = createSlice({
  name: "blogPosts",
  initialState: {
    blogPosts: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(fetchBlogPosts.pending, (state, action) => {
    //   state.blogPosts = [];
    //   state.loading = "loading";
    //   state.error = null;
    // });
    builder.addCase(fetchBlogPosts.fulfilled, (state, action) => {
      state.blogPosts = action.payload;
      state.loading = "loaded";
      state.error = null;
    });
    builder.addCase(fetchBlogPosts.rejected, (state, action) => {
      state.blogPosts = [];
      state.loading = "error";
      state.error = "error";
    });
  },
});

export const selectBlogPosts = (state) => state.blogPosts;

export default blogPostSlice;
