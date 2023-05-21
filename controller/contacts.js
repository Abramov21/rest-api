const {
  listContacts,
  getContactById,
  addNewContact,
  removeContact,
  updateContact,
} = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");

async function getListContacts(req, res, next) {
  try {
    const list = await listContacts();
    res.json(list);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contactGetId = await getContactById(contactId);
    if (!contactGetId) throw HttpError(404, "Not found");
    res.json(contactGetId);
  } catch (error) {
    next(error);
  }
}

async function removeContactId(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      throw HttpError(404, "Not found");
    } else {
      res.json({ message: "contact deleted" });
    }
  } catch (error) {
    next(error);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await addNewContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContacts(req, res, next) {
  try {
    const { contactId } = req.params;
    const newContact = await updateContact(contactId, req.body);
    if (newContact === null) {
      throw HttpError(404, "Not found");
    }
    res.json(newContact);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getListContacts,
  getById,
  addContact,
  removeContactId,
  updateContacts,
};
