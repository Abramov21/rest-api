const express = require("express");
const router = express.Router();
const { ctrlrWrapper } = require("../../helpers");

const validateBody = require("../../middlewares/validateBody.js");
const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controller/auth");
const authenticate = require("../../middlewares/authenticate");

const { authSchema } = require("../../models/users");

router.post("/register", validateBody(authSchema), ctrlrWrapper(register));

router.post("/login", validateBody(authSchema), ctrlrWrapper(login));

router.get("/current", authenticate, ctrlrWrapper(getCurrent));
router.post("/logout", authenticate, ctrlrWrapper(logout));

module.exports = router;
