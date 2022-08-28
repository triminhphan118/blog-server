const Users = require("../models/User");
const bcrypt = require("bcrypt");

const userController = {
  //GET ALL USERS
  getAllUser: async (req, res) => {
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
        fullname: new RegExp(keyword, "i"),
      };
    }
    try {
      const users = await Users.find(query).skip(start).limit(limit);
      users.map((user) => {
        if (user?.password) {
          delete user.password;
        }
        return user;
      });
      let total = await Users.count();
      if (keyword) {
        total = users.length;
      }
      res.status(200).json({
        total,
        users,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateUser: async (req, res) => {
    const idUser = req.params.id;
    if (!idUser) return res.status(404).json("User not found");
    const userOld = await Users.find({
      _id: {
        $ne: idUser,
      },
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
      return res.status(300).json("Username or email already exist.");
    }
    try {
      let userInfo = new Object({
        fullname: req.body.fullname,
        email: req.body.email,
        avatar: req.body.avatar,
        status: req.body.status,
        decs: req.body.decs,
        role: req.body.role,
      });
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);
        userInfo.password = hashed;
      }

      const user = await Users.findOneAndUpdate({ _id: idUser }, userInfo, {
        new: true,
      });
      if (!user) return res.status(404).json("Post not found cant not update.");
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    const idUser = req.params.id;
    if (!idUser) return res.status(404).json("User not found");
    try {
      const user = await Users.findOneAndDelete({
        _id: idUser,
      });
      if (!user) {
        return res.status(404).json("User not found can not delete.");
      }
      const results = await Users.find();
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = userController;
