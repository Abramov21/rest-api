const { Contact } = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");

async function getListContacts(req, res, next) {
  try {
    const list = await Contact.find();
    res.json(list);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contactGetId = await Contact.findById(contactId);
    if (!contactGetId) throw HttpError(404, "Not found");
    res.json(contactGetId);
  } catch (error) {
    next(error);
  }
}

async function removeContactId(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);
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
    const newContact = await Contact.create(req.body);
    if (!newContact) throw HttpError(404, "Not found");
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContacts(req, res, next) {
  try {
    const { contactId } = req.params;
    const newContact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!newContact) throw HttpError(404, "Not found");
    res.json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateFavoriteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const newContact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!newContact) throw HttpError(404, "Not found");
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
  updateFavoriteContact,
};
