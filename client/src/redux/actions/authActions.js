import axios from "axios";
const dev = process.env.NODE_ENV != "production";

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const sendOtp = async (phone) => {
  try {
    if (dev) console.log("==== SEND OTP ==== \n phone:", phone);
    const res = await axios.get(`/api/v1/send/otp/number/${phone}`);
    return res;
  } catch (error) {
    if (dev) console.log("==== SEND OTP ERROR ==== \n error:", error);
    return error.response;
  }
};

export const verifyOtp = async (phone, otp) => {
  try {
    if (dev)
      console.log("==== VERIFY OTP ==== \n phone:", phone, "\n otp:", otp);
    const res = await axios.post("/api/v1/verify/otp", { phone, otp });
    if (dev) console.log("==== VERIFY OTP RESPONSE ==== \n res:", res);
    if (res.status === 200) {
      // store cookie
      cookies.set("userToken", res.data.token, {
        maxAge: 60 * 60 * 24,
      });
    }
    return res;
  } catch (error) {
    if (dev) console.log("==== VERIFY OTP ERROR ==== \n error:", error);
    return error.response;
  }
};

export const onboard = async (name) => {
  try {
    const cookies = new Cookies();
    const cookieData = await cookies.getAll();
    const res = await axios.post(
      "/api/v1/onboard",
      { name },
      {
        headers: {
          Authorization: cookieData.userToken,
        },
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
export const logout = async () => {
  try {
    cookies.remove("userToken");
    return { status: 200, message: "Logged out successfully" };
  } catch (error) {
    if (dev) console.log("==== LOGOUT ERROR ==== \n error:", error);
    return error.response;
  }
};
