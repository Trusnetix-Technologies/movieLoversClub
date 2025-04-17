const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "blogposts" },
  },
  {
    timestamps: true,
  }
);

mongoose.model("likes", likeSchema);
