import axios from "axios";
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";

import { Cookies } from "react-cookie";

const dev = process.env.NODE_ENV != "production";

export const fetchMyLikes = createAsyncThunk("likes", async () => {
  try {
    const cookies = new Cookies();
    const cookieData = await cookies.getAll();

    console.log("cookieData", cookieData.userToken);

    const response = await axios.get(`/api/v1/user/get/my/likes`, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    throw { error: error.message };
  }
});

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    likes: [],
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyLikes.pending, (state, action) => {
      state.likes = [];
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(fetchMyLikes.fulfilled, (state, action) => {
      state.likes = action.payload;
      state.loading = "loaded";
      state.error = null;
    });
    builder.addCase(fetchMyLikes.rejected, (state, action) => {
      state.likes = [];
      state.loading = "error";
      state.error = "error";
    });
  },
});

export const selectLikes = (state) => state.likes;

export default likesSlice;
