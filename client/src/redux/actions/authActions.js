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
    return res;
  } catch (error) {
    if (dev) console.log("==== VERIFY OTP ERROR ==== \n error:", error);
    return error.response;
  }
};
