import createError from "http-errors";

import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import {parseContactFilterParams} from "../utils/filters/parseContactFilterParams.js";

import { sortByList } from "../db/models/Contact.js";

export const getContactsController = async (req, res) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilterParams(req.query);
    filter.userId = req.user._id;
       
    const { items, total, totalPages, hasNextPage, hasPrevPage } =
      await contactServices.getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter
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
        hasNextPage: hasNextPage,
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
  const {_id: userId } = req.user;
  const { id: _id } = req.params;
  
  
    // const { id } = req.params;
    const data = await contactServices.getContact({ _id, userId });

if (!data) {

    throw createError(404, `Contact with id=${_id} not found`);
   
  };
    res.json({
      status: 200,
      message: `Successfully found contact with id =${_id}`,
      data,
    });
};
   
export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
      
  const data = await contactServices.addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully add contact',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { isNew, data } = await contactServices.updateContact(id, {...req.body, userId}, {upsert: true});

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upsert contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const result = await contactServices.updateContact({ _id, userId }, req.body);

  if (!result) {
    throw createError(404, `Contact with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully upsert contact',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id, userId });

  if (!data) {
    throw createError(404, `Contact with id=${_id} not found`);
  }

  res.status(204).send();
};