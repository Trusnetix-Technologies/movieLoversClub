const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = Schema({
  title: { type: String },
  content: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  movie: { type: String },
  director: { type: String },
  image: { type: String },
  status: { type: String, default: "ACTIVE" }, // ACTIVE, DELETED
});

mongoose.model("blogposts", blogSchema);
