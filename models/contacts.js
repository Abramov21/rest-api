const fs = require("fs").promises;
const { readFile, writeFile } = fs;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const listContacts = await readFile(contactsPath, "utf8");
  return JSON.parse(listContacts);
}

async function getContactById(id) {
  const list = await listContacts();
  const contactId = list.find((item) => item.id === id);
  if (!contactId) return;
  return contactId;
}

async function addNewContact({ name, email, phone }) {
  const list = await listContacts();
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  list.push(newContact);
  const newList = JSON.stringify(list, null, "\t");

  await writeFile(contactsPath, newList, "utf8");
  return newContact;
}

async function removeContact(id) {
  const list = await listContacts();
  const contactId = list.find((item) => item.id === id);
  if (!contactId) {
    return;
  } else {
    const newList = list.filter((item) => item.id !== id);

    await writeFile(contactsPath, JSON.stringify(newList, null, "\t"), "utf8");
  }
  return contactId;
}

const updateContact = async (id, { name, email, phone }) => {
  const list = await listContacts();
  const contactId = list.find((item) => item.id === id);
  if (!contactId) {
    return null;
  }
  const newContact = { ...contactId, name, email, phone };
  const index = list.indexOf(contactId);
  list.splice(index, 1, newContact);
  const newList = JSON.stringify(list, null, "\t");
  await writeFile(contactsPath, newList, "utf8");

  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addNewContact,
  updateContact,
};
