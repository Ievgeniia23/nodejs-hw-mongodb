import ContactCollection from "../db/models/Contact.js";

import { calcPaginationdata } from "../utils/calcPaginationData.js";

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = "_id",
  sortOrder = "asc",
  filter ={},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;
console.log('Filter applied:', filter);

  const contactsQuery = ContactCollection.find();

  if (filter.userId) {
    console.log('Applying userId filter:', filter.userId);
    contactsQuery.where("userId").equals(filter.userId);
  }
 

// if (filter.type) {
//   contactsQuery.where('contactType').equals(filter.type);
// }

// if (filter.isFavourite !== undefined) {
//   contactsQuery.where('isFavourite').equals(filter.isFavourite);
// }
  
  
  const items = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  
   console.log('Contacts found:', items);
 
  
  const total = await ContactCollection.countDocuments(
    contactsQuery.getFilter(),
  );

   console.log('Total contacts count for user:', total);
  // const total = await ContactCollection.find().merge(contactsQuery).countDocuments();
  //   console.log('Contacts found:', items); 
  // console.log('Total contacts:', total);
  
  const paginationData = calcPaginationdata({ total, page, perPage });

  return {
    items,
    total,
    ...paginationData,
  };
};
    
 
export const getContactById = id => ContactCollection.findById(id);

export const getContact = filter => ContactCollection.findOne(filter);


export const addContact = payload => ContactCollection.create(payload);

export const updateContact= async (filter, payload, options = {}) => {
  const { upsert = false } = options;
  const result = await ContactCollection.findOneAndUpdate(filter, payload, {
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