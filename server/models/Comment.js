const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = Schema(
  {
    content: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "blogposts" },
    status: { type: String, default: "ACTIVE" }, // ACTIVE, DELETED
  },
  { timestamps: true }
);

mongoose.model("comments", commentSchema);
