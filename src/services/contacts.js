import ContactCollection from "../db/models/Contact.js";

import { calcPaginationdata } from "../utils/calcPaginationData.js";


export const getContacts = async ({ page = 1, perPage = 10 }) => {
    
  const limit = perPage;
  const skip = (page - 1) * limit;
  const items = await ContactCollection.find().skip(skip).limit(limit);
  const total = await ContactCollection.countDocuments();
  
  const paginationData = calcPaginationdata({ total, page, perPage });

  return {
    items,
    total,
    ...paginationData,
  };
};
    
 
export const getContactById = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContact= async (_id, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    upsert,
    runValidators: true,
    includeResultMetadata: true,
  });

  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return {
    isNew,
    data: result.value,
  };
};

export const deleteContact = (filter) => ContactCollection.findOneAndDelete(filter);