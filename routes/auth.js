const authController = require("../controllers/authController");
const middleware = require("../controllers/middleware");

const routerAuth = require("express").Router();
// register
routerAuth.post("/register", authController.register);

// login
routerAuth.post("/login", authController.login);

// refresh Token
routerAuth.post("/refresh", authController.refreshTokenUser);

// user logout
routerAuth.post("/logout", middleware.verifyToken, authController.userLogout);

module.exports = routerAuth;
