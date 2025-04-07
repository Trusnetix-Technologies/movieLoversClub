import axios from "axios";
import {
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";

import { Cookies } from "react-cookie";

const dev = process.env.NODE_ENV != "production";

export const fetchCurrentUser = createAsyncThunk("currentuser", async () => {
  try {
    const cookies = new Cookies();
    const cookieData = await cookies.getAll();

    console.log("cookieData", cookieData.userToken);

    const response = await axios.get(`/api/v1/current-user`, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    return response.data;
  } catch (error) {
    throw { error: error.message };
  }
});

const currentUserSlice = createSlice({
  name: "authData",
  initialState: {
    authData: "",
    loading: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state, action) => {
      state.authData = "";
      state.loading = "loading";
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.authData = action.payload;
      state.loading = "loaded";
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.authData = "error";
      state.loading = "error";
      state.error = "error";
    });
  },
});

export const selectAuthData = (state) => state.authData;

export default currentUserSlice;
