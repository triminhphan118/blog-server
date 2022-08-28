const router = require("express").Router();

const categoryController = require("../controllers/categoryController");
const middleware = require("../controllers/middleware");

router.get("/", middleware.verifyToken, categoryController.getAllCategories);
router.get("/all", categoryController.getAllCategoryPage);
router.post("/", middleware.verifyToken, categoryController.addCategory);
router.put("/:id", middleware.verifyToken, categoryController.updateCategory);
router.delete(
  "/:id",
  middleware.verifyToken,
  categoryController.deleteCategory
);

module.exports = router;
