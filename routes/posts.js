const router = require("express").Router();

const postsontroller = require("../controllers/postsController");
const middleware = require("../controllers/middleware");

router.get("/", middleware.verifyToken, postsontroller.getAllPosts);
router.get("/all", postsontroller.getPostsPage);

router.post("/", middleware.verifyToken, postsontroller.addPost);
router.put("/:id", middleware.verifyToken, postsontroller.updatePost);
router.delete("/:id", postsontroller.deletePost);

module.exports = router;
