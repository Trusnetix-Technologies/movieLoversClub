const mongoose = require("mongoose");

// ==== IMPORT SERVICES ====
const errorCodes = require("../../services/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const { requireLogin } = require("../../middleware/requireLogin");

// ==== IMPORT MODELS ====
const User = mongoose.model("users");

const ROUTE_TYPE = "ADMIN";

module.exports = (app) => {
  // =======================
  // ==== GET ALL USERS ====
  // =======================
  app.post("/api/v1/admin/get/users", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} GET USERS ==== \n body:`, req.body);
    try {
      const limit = parseInt(req.body.pageSize);
      const skip = parseInt(req.body.page);
      const search = req.body.search;
      const searchBy = req.body.searchBy;
      const orderBy = req.body.orderBy ?? null;
      const orderDirection = req.body.order ?? "";
      const filter = req.body.filter;
      const select = "-otp "; // select the fields to be returned

      let query = {
        status: "ACTIVE",
      };

      if (search) {
        query[searchBy] = { $regex: search, $options: "i" };
      }

      if (filter) {
        for (const key in filter) {
          if (filter[key]) {
            if (key[0] == "_") {
              query[key] = new mongoose.Types.ObjectId(filter[key]);
            } else {
              query[key] = filter[key];
            }
          }
        }
      }

      const sortBy = orderBy ? { [orderBy]: orderDirection } : { name: "desc" };

      const bank = await User.find(query, select)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

      const totalCount = await User.countDocuments(query);
      res.json({ data: bank, total: totalCount, page: skip });
    } catch (err) {
      console.log(`==== ${ROUTE_TYPE} GET USERS ERROR ==== \n error:`, err);
      res.status(500).json(errorCodes.server_error);
    }
  });

  // ========================
  // ==== GET USER BY ID ====
  // ========================
  app.get("/api/v1/admin/get/user/:id", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} GET USER BY ID ==== \n body:`, req.body);
    try {
      const user = await User.findById(req.params.id).select(
        "-otp -status -createdAt -updatedAt"
      );
      if (!user) {
        return res.status(400).json(errorCodes.user_not_found);
      }
      res.json(user);
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} GET USER BY ID ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =============================
  // ==== UPDATE USER DETAILS ====
  // =============================
  app.put("/api/v1/admin/update/user", requireLogin, async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} UPDATE USER DETAILS ==== \n body:`,
      req.body
    );
    try {
      const { _id, name, phone, plan, role } = req.body;
      const user = await User.findById(_id);
      if (!user) {
        return res.status(400).json(errorCodes.user_not_found);
      }
      const updateFields = {};
      if (name) updateFields.name = name.trim();
      if (phone) updateFields.phone = phone.trim();
      if (plan) updateFields.plan = plan.trim();
      if (role) updateFields.role = role.trim();

      const updatedUser = await User.updateOne({ _id }, { $set: updateFields });
      if (updatedUser.modifiedCount === 0) {
        return res.status(400).json(errorCodes.unable_to_update_details);
      }
      res.json({ message: "User details updated successfully", updatedUser });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} UPDATE USER DETAILS ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =============================
  // ==== DELETE USERS BY ID ====
  // =============================
  app.post("/api/v1/admin/delete/many/user", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} DELETE MANY USERS ==== \n body:`, req.body);
    try {
      const { ids } = req.body;
      const deletedUsers = await User.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "DELETED" } }
      );
      if (deletedUsers.modifiedCount === 0) {
        return res.status(400).json(errorCodes.unable_to_update_details);
      }
      res.json({ message: "Users deleted successfully", deletedUsers });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} DELETE MANY USERS ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });
};
