import createError from "http-errors";

import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {

    const contacts = await contactServices.getContacts();
    res.json(contacts);
  };

export const getContactByIdController = async (req, res) => {
   
    const { id } = req.params;
    const data = await contactServices.getContactById(id);

if (!data) {

    throw createError(404, `Contact with id=${id} not found`);
   
  }
    res.json({
      status: 200,
      message: `Successfully found contact with id =${id}`,
      data,
    });
};
   
export const addContactController = async (req, res) => {
  const data = await contactServices.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully add contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { isNew, data } = await contactServices.updateContact(id, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upsert contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateMovie(id, req.body);

  if (!result) {
    throw createError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully upsert contact',
    data: result.data,
  });
};

export const deleteContactieController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContact({ _id: id });

  if (!data) {
    throw createError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};