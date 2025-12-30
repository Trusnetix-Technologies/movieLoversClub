const fs = require("fs");
const mongoose = require("mongoose");
// ==== IMPORT SERVICES ====
const errorCodes = require("../../services/errorCodes");

// ==== IMPORT MIDDLEWARE ====
const { requireLogin } = require("../../middleware/requireLogin");
const { s3, upload } = require("../../services/aws");

// ==== IMPORT MODELS ====
const Blog = mongoose.model("blogposts");
const Like = mongoose.model("likes");
const Comment = mongoose.model("comments");
const ROUTE_TYPE = "USER";

module.exports = (app) => {
  // ============================
  // ==== GET ALL BLOG POSTS ====
  // ============================
  app.post("/api/v1/user/get/blog", async (req, res) => {
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
        query = {
          ...query,
          $or: [
            { title: { $regex: search.trim(), $options: "i" } },
            { description: { $regex: search.trim(), $options: "i" } },
            { content: { $regex: search.trim(), $options: "i" } },
            { movie: { $regex: search.trim(), $options: "i" } },
          ],
        };
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

      const sortBy = orderBy
        ? { [orderBy]: orderDirection }
        : { createdAt: -1 };

      console.log("==== QUERY ==== \n query:", query);

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
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "blog",
            as: "comments",
            pipeline: [
              {
                $match: {
                  status: "ACTIVE",
                },
              },
            ],
          },
        },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
            commentsCount: { $size: "$comments" },
          },
        },
        {
          $project: {
            likes: 0,
            comments: 0,
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
  app.get("/api/v1/user/get/blog/:id", async (req, res) => {
    console.log(
      `==== ${ROUTE_TYPE} GET BLOG POST BY ID ==== \n body:`,
      req.body
    );
    try {
      const blog = await Blog.findById(req.params.id).select("");
      const comments = await Comment.find({
        blog: req.params.id,
        status: "ACTIVE",
      })
        .populate("author")
        .sort({ createdAt: -1 });

      const likesCount = await Like.countDocuments({
        blog: req.params.id,
      });

      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }
      return res.json({
        ...blog._doc,
        comments,
        commentsCount: comments.length,
        likesCount,
      });
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

  // ==============================
  // ==== COMMENT ON BLOG POST ====
  // ==============================
  app.post("/api/v1/user/add/comment", requireLogin, async (req, res) => {
    console.log(`==== ${ROUTE_TYPE} ADD COMMENT ==== \n body:`, req.body);
    try {
      const { blogId, content } = req.body;
      const user = req.user;

      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(400).json(errorCodes.blog_not_found);
      }

      const comment = await Comment.create({
        content,
        author: user.id,
        blog: blogId,
      });

      res.json({ message: "Comment added successfully" });
    } catch (err) {
      console.log(
        `==== ${ROUTE_TYPE} COMMENT ON BLOG POST ERROR ==== \n error:`,
        err
      );
      res.status(500).json(errorCodes.server_error);
    }
  });

  // ========================
  // ==== DELETE COMMENT ====
  // ========================
  app.delete(
    "/api/v1/user/delete/comment/:id",
    requireLogin,
    async (req, res) => {
      console.log(`==== ${ROUTE_TYPE} DELETE COMMENT ==== \n body:`, req.body);
      try {
        const { id } = req.params;
        const user = req.user;

        const comment = await Comment.findById(id);
        if (!comment) {
          return res.status(400).json(errorCodes.comment_not_found);
        }

        await Comment.updateOne({ _id: id }, { $set: { status: "DELETED" } });
        return res.json({ message: "Comment deleted successfully" });
      } catch (err) {
        console.log(
          `==== ${ROUTE_TYPE} DELETE COMMENT ERROR ==== \n error:`,
          err
        );
        res.status(500).json(errorCodes.server_error);
      }
    }
  );
  // =======================
  // ==== ADD BLOG POST ====
  // =======================
  app.post(
    "/api/v1/user/add/blog",
    upload.single("image"),
    requireLogin,
    async (req, res) => {
      console.log(`==== ${ROUTE_TYPE} ADD BLOG POST ==== \n body:`, req.body);
      try {
        const {
          title,
          description,
          content,
          movie,
          director,
          genre,
          rating,
          image,
        } = req.body;
        const user = req.user;

        if (req.file) {
          const uploadFile = await s3
            .upload({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `blog-images/${req.file.filename}`,
              Body: fs.createReadStream(req.file.path),
              ContentType: req.file.mimetype,
              ACL: "public-read",
            })
            .promise();
          image = uploadFile.Location;
        }

        const blog = await Blog.create({
          title,
          content,
          description,
          movie,
          director,
          image,
          genre,
          rating,
          author: user.id,
        });

        return res.json({ message: "Blog post added successfully", blog });
      } catch (err) {
        console.log(
          `==== ${ROUTE_TYPE} ADD BLOG POST ERROR ==== \n error:`,
          err
        );
        res.status(500).json(errorCodes.server_error);
      }
    }
  );
};
