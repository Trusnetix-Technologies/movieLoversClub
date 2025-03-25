const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = Schema({
  name: { type: String },
  director: { type: String },
  duration: { type: String },
  genre: { type: String },
  description: { type: String },
  score: { type: String },
  image: { type: String },
});

mongoose.model("movies", movieSchema);
