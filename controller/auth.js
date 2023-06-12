const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BASE_URL, PORT } = process.env;
const { HttpError } = require("../helpers/index.js");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const avatarDir = path.resolve("public", "avatars");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../helpers/sendEmail");

async function register(req, res, next) {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ email });

    if (user) throw HttpError(409, "Email in use");

    const avatarUrl = gravatar.url(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = uuidv4();

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
      avatarUrl,
      verificationToken,
    });

    // const verifyLink = `${BASE_URL}:${PORT}/api/auth/verify/:${verificationToken}`;
    const verifyEmail = {
      to: email,
      subject: "verify email",
      html: verificationToken,
    };

    await sendEmail(verifyEmail);

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

    if (!user.verify) throw HttpError(404, "User is not verified");

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
  try {
    const { email, subscription } = req.user;
    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const resultDir = path.join(avatarDir, _id + originalname);

    await Jimp.read(tempPath).then((image) => {
      image.resize(250, 250).write(tempPath);
    });

    await fs.rename(tempPath, resultDir);
    const avatarUrl = path.join("avatars", originalname);
    await User.findByIdAndUpdate(_id, { avatarUrl });

    res.json({
      avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) throw HttpError(404, "User not found");

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw HttpError(400, "missing required field email");

    const user = await User.findOne({ email });
    if (!user) throw HttpError(404);

    if (user.verify)
      throw HttpError(400, "Verification has already been passed");

    // const verifyLink = `${BASE_URL}:${PORT}/api/auth/verify/:${user.verificationToken}`;
    const verifyEmail = {
      to: user.email,
      subject: "verify email",
      html: user.verificationToken,
    };

    await sendEmail(verifyEmail);
    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendVerify,
};
