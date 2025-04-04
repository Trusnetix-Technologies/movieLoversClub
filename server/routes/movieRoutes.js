const mongoose = require("mongoose");

const Movie = mongoose.model("movies");

module.exports = (app) => {
  app.get("/test", (req, res) => {
    console.log("Hi there!");
    res.send("Hi there! Also, Yay!");
  });

  app.get("/api/v1/get/movies", async (req, res) => {
    console.log("Movies List");
    const response = await Movie.find().populate("director", "name phone");
    res.send(response);
  });

  app.post("/api/v1/add/movie", async (req, res) => {
    const { name, director, duration, genre, description, score, image } =
      req.body;

    try {
      const movieFields = {
        name,
        director,
        duration,
        genre,
        description,
        score,
        image,
      };

      const response = await Movie.create(movieFields);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};
