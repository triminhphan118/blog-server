const router = require("express").Router();
const userController = require("../controllers/userController");
const middleware = require("../controllers/middleware");
const authController = require("../controllers/authController");

router.get("/", middleware.verifyToken, userController.getAllUser);
router.post("/", middleware.verifyToken, authController.register);
router.put("/:id", middleware.verifyToken, userController.updateUser);
router.delete("/:id", middleware.verifyTokenAndRole, userController.deleteUser);

module.exports = router;
