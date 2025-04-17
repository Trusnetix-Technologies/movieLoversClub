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
