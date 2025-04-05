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
