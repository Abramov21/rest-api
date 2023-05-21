const express = require("express");
const {
  updateContacts,
  getListContacts,
  removeContactId,
  getById,
  addContact,
} = require("../../controller/contacts");

const schema = require("../../schema/contacts");
const { ctrlrWrapper } = require("../../helpers");
const validateBody = require("../../middlewares/validateBody.js");
const router = express.Router();

router.get("/", ctrlrWrapper(getListContacts));

router.get("/:contactId", ctrlrWrapper(getById));

// router.post("/", validateBody(schema.schemaContact), addContact);
router.post("/", validateBody(schema.schemaContact), ctrlrWrapper(addContact));

router.delete("/:contactId", removeContactId);

router.put("/:contactId", validateBody(schema.schemaContact), updateContacts);

module.exports = router;
