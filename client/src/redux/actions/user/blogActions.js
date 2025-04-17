import axios from "axios";
const dev = process.env.NODE_ENV != "production";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getBlogPosts = async (values) => {
  try {
    const cookieData = await cookies.getAll();
    const res = await axios.post("/api/v1/user/get/blog", values, {
      headers: { Authorization: cookieData.userToken },
    });
    return res;
  } catch (error) {
    if (dev) console.log("==== GET BLOG POSTS ERROR ==== \n error:", error);
    return error.response;
  }
};

export const getBlogPostById = async (id) => {
  try {
    const cookieData = await cookies.getAll();
    const res = await axios.get(`/api/v1/user/get/blog/${id}`, {
      headers: { Authorization: cookieData.userToken },
    });
    return res;
  } catch (error) {
    if (dev)
      console.log("==== GET BLOG POST BY ID ERROR ==== \n error:", error);
    return error.response;
  }
};

export const likeBlogPost = async (values) => {
  try {
    const cookieData = await cookies.getAll();
    const res = await axios.post("/api/v1/user/like/blog", values, {
      headers: { Authorization: cookieData.userToken },
    });
    return res;
  } catch (error) {
    if (dev) console.log("==== LIKE BLOG POST ERROR ==== \n error:", error);
    return error.response;
  }
};

export const addComment = async (values, storeHooks) => {
  try {
    const cookieData = await cookies.getAll();
    const res = await axios.post("/api/v1/user/add/comment", values, {
      headers: { Authorization: cookieData.userToken },
    });

    if (res.status == 200) {
      storeHooks.handleOpenSnackBar("Comment added successfully", "success");
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== ADD COMMENT ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error adding comment", "error");
    return error.response;
  }
};

export const deleteComment = async (id, storeHooks) => {
  try {
    const cookieData = await cookies.getAll();
    const res = await axios.delete(`/api/v1/user/delete/comment/${id}`, {
      headers: { Authorization: cookieData.userToken },
    });

    if (res.status == 200) {
      storeHooks.handleOpenSnackBar("Comment deleted successfully", "success");
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== DELETE COMMENT ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error deleting comment", "error");
    return error.response;
  }
};
