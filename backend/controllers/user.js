const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const user = await User.findAll({ where: { email } });
    if (user.length > 0) {
      return res.status(409).json({ message: "user already exists!" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await User.create({ name, email, password: hash, phone });
      return res
        .status(201)
        .json({ message: "Successfully created new user!" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
