const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    name: { type: String },
    phone: { type: String },
    lastLogin: { type: Date, default: Date.now },
    otp: { type: String },
  },
  { timestamps: true }
);

mongoose.model("users", userSchema);
