const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {}).then(() => {
  console.log("Connected to MongoDB succesfully. Double Yay!");
});

// IMPORT MODELS
require("./models/movie");
require("./models/User");

// IMPORT ROUTES
require("./routes/movieRoutes")(app);
require("./routes/userRoutes")(app);

app.listen(process.env.PORT, () => {
  console.log("Server is running. Yay! Port: ", process.env.PORT);
});
