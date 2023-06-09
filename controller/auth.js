const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const { HttpError } = require("../helpers/index.js");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const avatarDir = path.resolve("public", "avatars");

async function register(req, res, next) {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email });

    if (user) throw HttpError(409, "Email in use");

    const avatarUrl = gravatar.url(email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      avatarUrl,
    });

    return res.status(201).json({
      user: { email: newUser.email, subsciption: newUser.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");

    const passwordCompareResult = await bcrypt.compare(password, user.password);
    if (!passwordCompareResult)
      throw HttpError(401, "Email or password is wrong");

    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "3h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subsciption: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempPath, originalname } = req.file;
  const resultDir = path.join(avatarDir, originalname);

  await Jimp.read(tempPath).then((image) => {
    image.resize(250, 250).write(tempPath);
  });

  await fs.rename(tempPath, resultDir);
  const avatarUrl = path.join("avatars", originalname);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.json({
    avatarUrl,
  });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
};
