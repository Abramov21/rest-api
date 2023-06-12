const express = require("express");
const router = express.Router();
const { ctrlrWrapper } = require("../../helpers");

const validateBody = require("../../middlewares/validateBody.js");
const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  resendVerify,
} = require("../../controller/auth");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const { authSchema, emailSchema } = require("../../models/users");

router.post("/register", validateBody(authSchema), ctrlrWrapper(register));

router.post("/login", validateBody(authSchema), ctrlrWrapper(login));

router.get("/current", authenticate, ctrlrWrapper(getCurrent));
router.post("/logout", authenticate, ctrlrWrapper(logout));

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlrWrapper(updateAvatar)
);

router.get("/verify/:verificationToken", ctrlrWrapper(verify));

router.post("/verify", validateBody(emailSchema), ctrlrWrapper(resendVerify));
module.exports = router;
