const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

// ==== IMPORT SERVICES ====
const errorCodes = require("../services/errorCodes");
const { generateToken, requireLogin } = require("../middleware/requireLogin");

// ==== IMPORT MODELS ====
const User = mongoose.model("users");

module.exports = (app) => {
  const OTP_LENGTH = 6;
  const resetTime = 1000 * 60 * 5; // 5 minutes

  // ==================
  // ==== SEND OTP ====
  // ==================
  // ----- OTP FUNCTIONS START ----
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 10 requests per windowMs
    message: "Too many requests, please try again later.",
  });
  // GENERATE AND SEND OTP
  const generateOTP = () => {
    const digits = "0123456789";
    let newOTP = "";
    for (let i = 0; i < OTP_LENGTH; i++) {
      newOTP += digits[Math.floor(Math.random() * digits.length)];
    }
    return newOTP;
  };

  // RESET OTP
  const resetOTP = (phone) => {
    const digits = "0123456789";
    setTimeout(async () => {
      let newOTP = "";
      for (let i = 0; i <= OTP_LENGTH + 1; i++) {
        newOTP += digits[Math.floor(Math.random() * 10)];
      }
      const user = await User.updateOne(
        { phone },
        { $set: { otp: newOTP } },
        { new: true }
      );
    }, resetTime);
  };

  // ROUTE
  app.get("/api/v1/send/otp/number/:phone", limiter, async (req, res) => {
    try {
      const { phone } = req.params;
      const otp = generateOTP();
      console.log("==== SEND OTP ==== \n otp:", otp);
      // store the otp in the database
      const user = await User.updateOne(
        { phone },
        { $set: { otp: otp } },
        { new: true, upsert: true } // upsert: true, if the user does not exist, create a new user
      );
      // reset the otp after 5 minutes
      resetOTP(phone);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.log("==== SEND OTP ERROR ==== \n error:", error);
      res.status(400).json(errorCodes.server_error);
    }
  });

  // ---- OTP FUNCTIONS END ----
  // ====================
  // ==== VERIFY OTP ====
  // ====================
  app.post("/api/v1/verify/otp", limiter, async (req, res) => {
    console.log("==== VERIFY OTP ==== \n body:", req.body);
    try {
      const { phone, otp } = req.body;
      const user = await User.findOne({ phone, status: "ACTIVE" });
      // check if user exists
      if (!user) {
        return res.status(400).json(errorCodes.user_not_found);
      }

      // check otp length
      if (otp.length !== OTP_LENGTH) {
        return res.status(400).json(errorCodes.invalid_otp);
      }

      // check if otp is correct
      if (user.otp !== otp) {
        return res.status(400).json(errorCodes.invalid_otp);
      }
      // generate a token
      const payload = {
        id: user._id,
        phone: user.phone,
        status: user.status,
        name: user.name,
        plan: user.plan,
      };
      const token = generateToken(payload);

      // update the user's last login date
      await User.updateOne(
        { _id: user._id },
        { $set: { lastLogin: Date.now() } }
      );

      res
        .status(200)
        .json({ message: "OTP verified successfully", user, token });
    } catch (err) {
      console.log("==== VERIFY OTP ERROR ==== \n error:", err);
      res.status(400).json(errorCodes.server_error);
    }
  });

  // ==================
  // ==== ONBOARD ====
  // ==================
  app.post("/api/v1/onboard", requireLogin, async (req, res) => {
    console.log("==== ONBOARD ==== \n body:", req.body);
    try {
      const { name } = req.body;
      const useFields = {};
      useFields.name = name.trim();
      useFields.isOnboarded = true;

      const user = await User.updateOne(
        { _id: req.user.id },
        { $set: useFields },
        { new: true }
      );

      if (user.modifiedCount === 0) {
        return res.status(400).json(errorCodes.user_not_found);
      }

      res.status(200).json({ message: "Onboarded successfully" });
    } catch (error) {
      console.log("==== ONBOARD ERROR ==== \n error:", error);
      res.status(400).json(errorCodes.server_error);
    }
  });

  // ================
  // ==== SIGNUP ====
  // ================
  //   app.post("/api/v1/signup", limiter, async (req, res) => {
  //     console.log("==== SIGNUP ==== \n body:", req.body);
  //     try {
  //       const { phone, otp, name } = req.body;

  //       const useFields = {
  //         phone,
  //         name: name.trim(),
  //       };

  //       // validate body
  //       if (!phone || !otp || !name || phone.length !== 10 || name.length < 3) {
  //         return res.status(400).json(errorCodes.invalid_body);
  //       }

  //       // check if user exists
  //       const user = await User.findOne({ phone, status: "ACTIVE" });
  //       if (!user) {
  //         return res.status(400).json(errorCodes.user_not_found);
  //       }
  //       // check otp length
  //       if (otp.length !== OTP_LENGTH) {
  //         return res.status(400).json(errorCodes.invalid_otp);
  //       }
  //       // check if otp is correct
  //       if (user.otp !== otp) {
  //         return res.status(400).json(errorCodes.invalid_otp);
  //       }
  //       // create a new user
  //       const newUser = await User.updateOne(
  //         { phone },
  //         { $set: useFields },
  //         { new: true }
  //       );

  //       // generate a token
  //       const payload = {
  //         id: newUser._id,
  //         phone: newUser.phone,
  //         status: newUser.status,
  //         name: newUser.name,
  //       };
  //       const token = generateToken(payload);
  //       res.status(200).json({ message: "Signup successful", token });
  //     } catch (error) {
  //       console.log("==== SIGNUP ERROR ==== \n error:", error);
  //       res.status(400).json(errorCodes.server_error);
  //     }
  //   });

  // ======================
  // ==== CURRENT USER ====
  // ======================
  app.get("/api/v1/current-user", requireLogin, async (req, res) => {
    console.log("==== CURRENT USER ==== \n ");
    try {
      console.log("req.user :", req.user);
      const user = await User.findOne({ _id: req.user.id }).select(
        "-otp -status -createdAt -updatedAt"
      ); // select the fields to be returned
      if (!user) {
        return res.status(400).json(errorCodes.unauthorized);
      }
      res.status(200).json(user);
    } catch (error) {
      console.log("==== CURRENT USER ERROR ==== \n error:", error);
      res.status(400).json(errorCodes.server_error);
    }
  });
};
