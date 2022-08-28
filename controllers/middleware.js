const jwt = require("jsonwebtoken");

const middleware = {
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const token_Key = token.split(" ")[1];
      jwt.verify(token_Key, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          return res.status(400).json("Token in valid.");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(500).json("You are not authenticated.");
    }
  },

  verifyTokenAndRole: (req, res, next) => {
    middleware.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.role === 1) {
        next();
      } else {
        return res.status(401).json("You not allowed delete user.");
      }
    });
  },
};

module.exports = middleware;
