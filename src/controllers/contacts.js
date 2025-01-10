import createError from "http-errors";

import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

import { sortByList } from "../db/models/Contact.js";


export const getContactsController = async (req, res) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);

    const { items, total, totalPages, hasNextPage, hasPrevPage } =
      await contactServices.getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
      });
    res.json({
      status: 200,
      message: 'Successfully found contacts',
      data: {
        data: items,
        page,
        perPage,
        totalItems: total,
        totalPages,
        hasPreviousPage: hasPrevPage,
        hasNextPage,
      },
    });
  } catch (error) {
    
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      data: error.message,
    });
  }
};

export const getContactByIdController = async (req, res) => {
   
    const { id } = req.params;
    const data = await contactServices.getContactById(id);

if (!data) {

    throw createError(404, `Contact with id=${id} not found`);
   
  };
    res.json({
      status: 200,
      message: `Successfully found contact with id =${id}`,
      data,
    });
};
   
export const addContactController = async (req, res) => {
  // try {
  //   await contactAddSchema.validateAsync(req.body, {
  // abortEarly: false,
  //   });
  // }
  //  catch (error) {
  //   throw createError(400, error.message);
  // }
  
  const data = await contactServices.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully add contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
    // try {
    //   await contactAddSchema.validateAsync(req.body, {
    //     abortEarly: false,
    //   });
    // } catch (error) {
    //   throw createError(400, error.message);
    // }
  
  
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
  // try {
  //   await contactUpdateSchema.validateAsync(req.body, {
  //     abortEarly: false,
  //   });
  // } catch (error) {
  //   throw createError(400, error.message);
  // }
   
  
  
  const { id } = req.params;
  const result = await contactServices.updateContact(id, req.body);

  if (!result) {
    throw createError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully upsert contact',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContact({ _id: id });

  if (!data) {
    throw createError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};