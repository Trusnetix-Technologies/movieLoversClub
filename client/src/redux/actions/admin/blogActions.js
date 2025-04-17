import axios from "axios";
const dev = process.env.NODE_ENV != "production";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getBlogPosts = async (values) => {
  const cookieData = await cookies.getAll();

  const res = await axios.post("/api/v1/admin/get/blog", values, {
    headers: {
      Authorization: cookieData.userToken,
    },
  });
  return res;
};

export const deleteMultipleBlogPosts = async (values) => {
  const cookieData = await cookies.getAll();
  try {
    const res = await axios.post("/api/v1/admin/delete/many/blog", values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getBlogPostById = async (id, storeHooks) => {
  try {
    if (dev) console.log("==== GET BLOG POST BY ID ==== \n id:", id);
    const cookieData = await cookies.getAll();
    const res = await axios.get(`/api/v1/admin/get/blog/${id}`, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    return res;
  } catch (error) {
    if (dev)
      console.log("==== GET BLOG POST BY ID ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error fetching Blog Post", "error");
    return error.response;
  }
};

export const addBlogPost = async (values, storeHooks) => {
  const cookieData = await cookies.getAll();
  try {
    if (dev) console.log("==== ADD BLOG POST ==== \n values:", values);
    const res = await axios.post("/api/v1/admin/add/blog", values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    if (res.status == 200) {
      storeHooks.handleOpenSnackBar("Blog post added successfully", "success");
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== ADD BLOG POST ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error adding blog post", "error");
    return error.response;
  }
};

export const updateBlogPost = async (values, storeHooks) => {
  const cookieData = await cookies.getAll();
  try {
    const res = await axios.put("/api/v1/admin/update/blog", values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    if (res.status == 200) {
      storeHooks.handleOpenSnackBar(
        "Blog post updated successfully",
        "success"
      );
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== UPDATE USER ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error updating user", "error");
    return error.response;
  }
};
