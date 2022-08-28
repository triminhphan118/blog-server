const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authController = {
  register: async (req, res) => {
    const userOld = await User.find({
      $or: [
        {
          username: new RegExp("^" + req.body.username + "$", "i"),
        },
        {
          email: new RegExp("^" + req.body.email + "$", "i"),
        },
      ],
    });
    if (userOld.length > 0) {
      return res.status(300).json("Username or slug already exist.");
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        username: req.body.username,
        fullname: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar,
        status: req.body.status,
        role: req.body.role,
        password: hashed,
      });
      const user = await newUser.save();

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  generateToken: (user) => {
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "59s" }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
    return { accessToken, refreshToken };
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong usernames");
      }
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!checkPassword) {
        return res.status(404).json("Wrong password");
      }

      if (user && checkPassword) {
        const { accessToken, refreshToken } = authController.generateToken(
          user._doc
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...rest } = user._doc;

        await User.findOneAndUpdate(
          { id: user._id },
          {
            token: refreshToken,
          }
        );

        return res.status(200).json({ ...rest, accessToken });
      } else {
        return res.status(403).json(user);
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  refreshTokenUser: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    const user = User.find({
      id: req.body.id,
    });
    if (!user.refreshToken === refreshToken) {
      res.clearCookie("refreshToken");
      await User.findOneAndUpdate(
        { id: user._id },
        {
          token: refreshToken,
        }
      );
      return res.status(402).json("RefreshToken in valid.");
    }
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_KEY,
      async (error, user) => {
        if (error) {
          return res.status(401).json("Token in valid");
        }
        const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
          authController.generateToken(user);
        await User.findOneAndUpdate(
          { id: user._id },
          {
            token: refreshToken,
          }
        );
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        return res.status(200).json(newAccessToken);
      }
    );
  },

  userLogout: async (req, res) => {
    await User.findOneAndUpdate(
      { id: req.body.id },
      {
        token: {},
      }
    );
    res.clearCookie("refreshToken");
    res.status(200).json("Logout...");
  },
};

module.exports = authController;
