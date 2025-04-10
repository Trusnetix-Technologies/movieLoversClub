const mongoose = require("mongoose");

// ==== IMPORT SERVICES ====
const errorCodes = require("../../services/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const { requireLogin } = require("../../middleware/requireLogin");

// ==== IMPORT MODELS ====
const Blog = mongoose.model("blogposts");

const ROUTE_TYPE = "USER";

module.exports = (app) => {
  // ============================
  // ==== GET ALL BLOG POSTS ====
  // ============================
  app.post("/api/v1/user/get/blog", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} GET BLOG POSTS ==== \n body:`, req.body);
    try {
      const limit = parseInt(req.body.pageSize);
      const skip = parseInt(req.body.page);
      const search = req.body.search;
      const searchBy = req.body.searchBy;
      const orderBy = req.body.orderBy ?? null;
      const orderDirection = req.body.order ?? "";
      const filter = req.body.filter;
      const select = " "; // select the fields to be returned

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

      const blogs = await Blog.find(query, select)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

      const totalCount = await Blog.countDocuments(query);
      res.json({ data: blogs, total: totalCount, page: skip });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} GET BLOG POSTS ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =============================
  // ==== GET BLOG POST BY ID ====
  // =============================
  app.get("/api/v1/user/get/blog/:id", requireLogin, async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} GET BLOG POST BY ID ==== \n body:`,
      req.body
    );
    try {
      const blog = await Blog.findById(req.params.id).select("");

      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }
      return res.json(blog);
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} GET BLOG POST BY ID ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });
};
