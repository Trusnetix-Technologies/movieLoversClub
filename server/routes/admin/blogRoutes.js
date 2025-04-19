const mongoose = require("mongoose");

// ==== IMPORT SERVICES ====
const errorCodes = require("../../services/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const { requireLogin } = require("../../middleware/requireLogin");

// ==== IMPORT MODELS ====
const User = mongoose.model("users");
const Blog = mongoose.model("blogposts");

const ROUTE_TYPE = "ADMIN";

module.exports = (app) => {
  // ============================
  // ==== GET ALL BLOG POSTS ====
  // ============================
  app.post("/api/v1/admin/get/blog", requireLogin, async (req, res) => {
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
  app.get("/api/v1/admin/get/blog/:id", requireLogin, async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} GET BLOG POST BY ID ==== \n body:`,
      req.body
    );
    try {
      const blog = await Blog.findById(req.params.id).select("");
      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }
      res.json(blog);
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} GET BLOG POST BY ID ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =============================
  // ==== ADD BLOG POST ====
  // =============================
  app.post("/api/v1/admin/add/blog", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} ADD BLOG POST ==== \n body:`, req.body);
    try {
      const { title, content, description, movie, director, image } = req.body;
      const blog = await Blog.create({
        title,
        content,
        description,
        movie,
        director,
        image,
        author: req.user._id,
      });
      res.json({ message: "Blog post added successfully", blog });
    } catch (err) {
      console.log(`==== ${ROUTE_TYPE} ADD BLOG POST ERROR ==== \n error:`, err);
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =============================
  // ==== UPDATE BLOG POST ====
  // =============================
  app.put("/api/v1/admin/update/blog", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} UPDATE BLOG POST ==== \n body:`, req.body);
    try {
      const { _id, title, content, movie, director, image } = req.body;
      const blog = await Blog.findById(_id);
      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }
      const updateFields = {};
      if (title) updateFields.title = title.trim();
      if (content) updateFields.content = content.trim();
      if (movie) updateFields.movie = movie.trim();
      if (director) updateFields.director = director.trim();
      if (image) updateFields.image = image.trim();

      const updatedBlog = await Blog.updateOne({ _id }, { $set: updateFields });
      if (updatedBlog.modifiedCount === 0) {
        return res.status(400).json(errorCodes.unable_to_update_details);
      }
      res.json({ message: "Blog post updated successfully", updatedBlog });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} UPDATE BLOG POST ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // =================================
  // ==== DELETE BLOG POSTS BY ID ====
  // =================================
  app.post("/api/v1/admin/delete/many/blog", requireLogin, async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} DELETE MANY BLOG POSTS ==== \n body:`,
      req.body
    );
    try {
      const { ids } = req.body;
      const deletedBlog = await Blog.updateMany(
        { _id: { $in: ids } },
        { $set: { status: "DELETED" } }
      );
      if (deletedBlog.modifiedCount === 0) {
        return res.status(400).json(errorCodes.unable_to_update_details);
      }
      res.json({ message: "Blog posts deleted successfully", deletedBlog });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} DELETE MANY BLOG POSTS ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });
};
