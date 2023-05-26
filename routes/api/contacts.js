const express = require("express");
const {
  updateContacts,
  getListContacts,
  removeContactId,
  getById,
  addContact,
  updateFavoriteContact,
} = require("../../controller/contacts");

const {
  schemaAddContact,
  updateFavoriteSchema,
} = require("../../models/contacts");
const { ctrlrWrapper } = require("../../helpers");
const validateBody = require("../../middlewares/validateBody.js");
const isValidById = require("../../middlewares/isValidById");
const router = express.Router();

router.get("/", ctrlrWrapper(getListContacts));

router.get("/:contactId", isValidById, ctrlrWrapper(getById));

router.post("/", validateBody(schemaAddContact), ctrlrWrapper(addContact));

router.delete("/:contactId", isValidById, ctrlrWrapper(removeContactId));

router.put(
  "/:contactId",
  isValidById,
  validateBody(schemaAddContact),
  ctrlrWrapper(updateContacts)
);

router.patch(
  "/:contactId/favorite",
  isValidById,
  validateBody(updateFavoriteSchema),
  ctrlrWrapper(updateFavoriteContact)
);

module.exports = router;
