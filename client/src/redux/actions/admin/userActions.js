import axios from "axios";
const dev = process.env.NODE_ENV != "production";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getUsers = async (values) => {
  const cookieData = await cookies.getAll();

  const res = await axios.post("/api/v1/admin/get/users", values, {
    headers: {
      Authorization: cookieData.userToken,
    },
  });
  return res;
};

export const deleteMultipleUsers = async (values) => {
  const cookieData = await cookies.getAll();
  try {
    const res = await axios.post("/api/v1/admin/delete/many/user", values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getUserById = async (id, storeHooks) => {
  try {
    if (dev) console.log("==== GET USER BY ID ==== \n id:", id);
    const cookieData = await cookies.getAll();
    const res = await axios.get(`/api/v1/admin/get/user/${id}`, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    return res;
  } catch (error) {
    if (dev) console.log("==== GET USER BY ID ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error fetching user", "error");
    return error.response;
  }
};

export const updateUser = async (values, storeHooks) => {
  const cookieData = await cookies.getAll();
  try {
    const res = await axios.put("/api/v1/admin/update/user", values, {
      headers: {
        Authorization: cookieData.userToken,
      },
    });
    if (res.status == 200) {
      storeHooks.handleOpenSnackBar("User updated successfully", "success");
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== UPDATE USER ERROR ==== \n error:", error);
    storeHooks.handleOpenSnackBar("Error updating user", "error");
    return error.response;
  }
};
