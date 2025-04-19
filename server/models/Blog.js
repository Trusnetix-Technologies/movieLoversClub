const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = Schema(
  {
    title: { type: String },
    content: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    movie: { type: String },
    director: { type: String },
    genre: { type: String },
    rating: { type: Number },
    description: { type: String },
    image: { type: String },
    status: { type: String, default: "ACTIVE" }, // ACTIVE, DELETED
  },
  { timestamps: true }
);

mongoose.model("blogposts", blogSchema);
