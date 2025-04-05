const mongoose = require("mongoose");
const { Schema } = mongoose;

/* types - 
  OPEN, 
  LOGGED_IN,
  PRO,
  ADMIN
*/

const userSchema = Schema(
  {
    name: String,
    otp: String,
    phone: String,
    isOnboarded: { type: Boolean, default: false },
    plan: { type: String, default: "FREE" }, // FREE, PRO
    lastLogin: { type: Date, default: Date.now },
    role: { type: String, default: "USER" }, // USER, ADMIN
    status: { type: String, default: "ACTIVE" }, // ACTIVE, DELETED
  },
  { timestamps: true }
);

mongoose.model("users", userSchema);
