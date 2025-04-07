const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express(); // Create Express app
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
  console.log("Connected to MongoDB succesfully. Double Yay!");
});

// ==== IMPORT MODELS ====
require("./models/movie");
require("./models/User");
require("./models/Blog");

// ==== IMPORT ROUTES ====
// ---- COMMON ----`
require("./routes/authRoutes")(app);

// ---- ADMIN ----
require("./routes/admin/userRoutes")(app);
require("./routes/admin/blogRoutes")(app);
// ---- USER ----

// Start the server
app.listen(process.env.PORT, () => {
  console.log("Server is running. Yay! Port: ", process.env.PORT);
});
