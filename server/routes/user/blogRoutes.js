const mongoose = require("mongoose");

// ==== IMPORT SERVICES ====
const errorCodes = require("../../services/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const { requireLogin } = require("../../middleware/requireLogin");

// ==== IMPORT MODELS ====
const Blog = mongoose.model("blogposts");
const Like = mongoose.model("likes");

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

      const sortBy = orderBy ? { [orderBy]: orderDirection } : { name: -1 };

      const blogs = await Blog.aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: {
            path: "$author",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "blog",
            as: "likes",
          },
        },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        {
          $project: {
            likes: 0,
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "total" }],
            data: [
              { $sort: sortBy },
              { $skip: parseInt(skip) * limit },
              { $limit: parseInt(limit) },
            ],
          },
        },
        {
          $unwind: "$totalCount",
        },
        {
          $addFields: {
            totalCount: "$totalCount.total",
            page: skip,
          },
        },
      ]);

      res.json(blogs[0] ?? { data: [], total: 0, page: skip });
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

  // ========================
  // ==== LIKE BLOG POST ====
  // ========================
  app.post("/api/v1/user/like/blog", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} LIKE BLOG POST ==== \n body:`, req.body);
    try {
      const { blogId } = req.body;
      const user = req.user;

      const blog = await Blog.findById(blogId);
      console.log("==== BLOG ==== \n blog:", blog);
      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }

      const like = await Like.findOne({ user: user._id, blog: blogId });
      console.log("==== LIKE ==== \n like:", like);
      if (like) {
        await Like.deleteOne({ _id: like._id });
        console.log("==== LIKE DELETED ==== \n like:", like);
        return res.json({ message: "Blog post unliked successfully" });
      }

      const newLike = new Like({ user: user._id, blog: blogId });
      await newLike.save();
      res.json({ message: "Blog post liked successfully" });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} LIKE BLOG POST ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // ======================
  // ==== GET MY LIKES ====
  // ======================
  app.get("/api/v1/user/get/my/likes", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} GET MY LIKES ==== \n body:`, req.body);
    try {
      const userID = req.user._id;
      const likes = await Like.find({ user: userID });
      return res.json(likes);
    } catch (err) {
      console.log(`==== ${ROUTE_TYPE} GET MY LIKES ERROR ==== \n error:`, err);
      res.status(500).json(errorCodes.server_error);
    }
  });
};
