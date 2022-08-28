const { json } = require("express");
const Posts = require("../models/Posts");

const postsController = {
  getAllPosts: async (req, res) => {
    let page = req.query.page;
    let limit = req.query.limit;
    let keyword = req.query.q;
    if ((page && page < 1) || typeof page === "number") {
      page = 1;
    }
    if ((limit && limit < 1) || typeof limit === "number") {
      limit = 1;
    }
    let start = (page - 1) * limit;
    let query = {};
    if (keyword) {
      query = {
        title: new RegExp(keyword, "i"),
      };
    }
    try {
      const posts = await Posts.find(query)
        .skip(start)
        .limit(limit)
        .populate(["user", "category"]);
      let total = await Posts.count();
      if (keyword) {
        total = posts.length;
      }
      return res.status(200).json({
        total,
        posts,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getPostsPage: async (req, res) => {
    let limit = req.query.limit;
    let query = { status: 1 };
    if ((limit && limit < 1) || typeof limit === "number") {
      limit = -1;
    }
    if (req.body.category) {
      query.category = req.body.category;
    }
    try {
      const posts = await Posts.find(query)
        .limit(limit)
        .sort({ createdAt: 1 })
        .populate(["user", "category"]);

      let total = await Posts.count({ status: 1 });
      return res.status(200).json({ total, posts });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  addPost: async (req, res) => {
    const postOld = await Posts.find({
      $or: [
        {
          slug: new RegExp(req.body.slug, "i"),
        },
        {
          title: new RegExp(req.body.title, "i"),
        },
      ],
    });
    if (postOld.length > 0) {
      return res.status(300).json("Post title or slug already exist.");
    }
    try {
      let string = req.body.content.replace(/<[^>]+>/g, "");
      let decs = string.slice(0, 100);
      const newPost = new Posts({
        title: req.body.title,
        slug: req.body.slug,
        image: req.body.image,
        decs: decs,
        content: req.body.content,
        hot: req.body.hot || 1,
        status: req.body.status || 1,

        user: req.body.user,
        category: req.body.category,
      });

      await newPost.save();
      return res.status(200).json(newPost);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updatePost: async (req, res) => {
    const idPost = req.params.id;
    if (!idPost) return res.status(404).json("Category not found");
    const postOld = await Posts.find({
      _id: {
        $ne: idPost,
      },
      $or: [
        {
          slug: new RegExp("^" + req.body.slug + "$", "i"),
        },
        {
          title: new RegExp("^" + req.body.title + "$", "i"),
        },
      ],
    });
    if (postOld.length > 0) {
      return res.status(300).json("Post title or slug already exist.");
    }
    try {
      const post = await Posts.findOneAndUpdate(
        { _id: idPost },
        {
          title: req.body.title,
          slug: req.body.slug,
          image: req.body.image,
          decs: req.body.decs,
          content: req.body.content,
          hot: req.body.hot,
          status: req.body.status,

          user: req.body.user,
          category: req.body.category,
        },
        { new: true }
      ).populate(["user", "category"]);
      if (!post) return res.status(404).json("Post not found cant not update.");
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deletePost: async (req, res) => {
    const idPost = req.params.id;
    if (!idPost) return res.status(404).json("Category not found");
    try {
      const post = await Posts.findOneAndDelete({
        _id: idPost,
      });
      if (!post) {
        return res.status(404).json("Post not found can not delete.");
      }
      const results = await Posts.find({}).populate(["user", "category"]);
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = postsController;
