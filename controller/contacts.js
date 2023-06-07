const { Contact } = require("../models/contacts");
const { HttpError } = require("../helpers/index.js");

async function getListContacts(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const list = await Contact.find({ owner });
    res.json(list);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;
    const contactGetId = await Contact.findOne({ _id: contactId, owner });
    if (!contactGetId) throw HttpError(404, "Not found");
    res.json(contactGetId);
  } catch (error) {
    next(error);
  }
}

async function removeContactId(req, res, next) {
  try {
    const { _id: owner } = req.user;

    const { contactId } = req.params;
    const contact = await Contact.deleteOne({ _id: contactId, owner });
    if (contact.deletedCount == 0) {
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
    const { _id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    if (!newContact) throw HttpError(404, "Not found");
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
}

async function updateContacts(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const newContact = await Contact.findOne({ _id: contactId, owner });

    if (!newContact) throw HttpError(404, "Not found");

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) throw HttpError(404, "Not found");
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function updateFavoriteContact(req, res, next) {
  try {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const newContact = await Contact.findOne({ _id: contactId, owner });

    if (!newContact) throw HttpError(404, "Not found");

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) throw HttpError(404, "Not found");
    res.json(result);
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
