const Categories = require("../models/Categories");

const categoryController = {
  getAllCategories: async (req, res) => {
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
        name: new RegExp(keyword, "i"),
      };
    }
    try {
      const categories = await Categories.find(query).skip(start).limit(limit);
      let total = await Categories.count();
      if (keyword) {
        total = categories.length;
      }
      return res.status(200).json({
        total,
        categories,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  getAllCategoryPage: async (req, res) => {
    try {
      const categories = await Categories.find({ status: 1 }).sort({
        createdAt: 1,
      });
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  addCategory: async (req, res) => {
    const categoryOld = await Categories.find({
      $or: [
        {
          slug: new RegExp(req.body.slug, "i"),
        },
        {
          name: new RegExp(req.body.name, "i"),
        },
      ],
    });
    if (categoryOld.length > 0) {
      return res.status(300).json("Category name or slug already exist.");
    }
    try {
      const newCategory = new Categories({
        name: req.body.name,
        slug: req.body.slug,
        status: req.body.status || 1,
      });

      await newCategory.save();
      return res.status(200).json(newCategory);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateCategory: async (req, res) => {
    const idCategory = req.params.id;
    if (!idCategory) return res.status(404).json("Category not found");
    const categoryOld = await Categories.find({
      _id: {
        $ne: idCategory,
      },
      $or: [
        {
          slug: new RegExp("^" + req.body.slug + "$", "i"),
        },
        {
          name: new RegExp("^" + req.body.name + "$", "i"),
        },
      ],
    });
    if (categoryOld.length > 0) {
      return res.status(300).json("Category name or slug already exist.");
    }
    try {
      const category = await Categories.findOneAndUpdate(
        { _id: idCategory },
        {
          name: req.body.name,
          slug: req.body.slug,
          status: req.body.status,
        },
        { new: true }
      );
      if (!category)
        return res.status(404).json("Category not found cant not update.");
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteCategory: async (req, res) => {
    const idCategory = req.params.id;
    if (!idCategory) return res.status(404).json("Category not found");
    try {
      const category = await Categories.findOneAndDelete({
        id: idCategory,
      });
      if (!category) {
        return res.status(404).json("Category not found can not delete.");
      }
      const results = await Categories.find({});
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = categoryController;
