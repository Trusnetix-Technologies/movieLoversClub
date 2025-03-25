const mongoose = require("mongoose");

const User = mongoose.model("users");

module.exports = (app) => {
  // Users Register Here
  app.post("/api/v1/user/register", async (req, res) => {
    console.log("Creating New User:");
    const { name, phone, otp } = req.body;
    try {
      const user = await User.findOne({ phone });
      if (user) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const userFields = {
        name,
        phone,
        otp,
      };

      const response = await User.create(userFields);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Send an OTP

  // User Logs In Here

  // Current User Info
  app.get("/api/v1/user/current/:_id", async (req, res) => {
    console.log("Getting Current User Info");
    const _id = req.params._id; // Sent using
    try {
      const user = await User.findOne({ _id });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Update User Info
  app.put("/api/v1/user/update", async (req, res) => {
    console.log("Updating User Info");
    const { _id, name, phone, otp } = req.body;
    try {
      const userFields = {
        name,
        phone,
        otp,
      };

      const response = await User.updateOne(
        { _id: req.body._id },
        { $set: userFields }
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete User
  app.delete("/api/v1/user/delete/:_id", async (req, res) => {
    console.log("Deleting User");
    const _id = req.params._id;
    try {
      const user = await User.findOne({ _id });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const response = await User.deleteOne({ _id });
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // Log Out User
};
