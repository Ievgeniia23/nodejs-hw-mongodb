import Joi from "joi";

import { typeList } from "../constans/contacts.js";

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  phoneNumber: Joi.string().min(3).max(20).required(),

  email: Joi.string().min(3).max(20).email().allow(null).optional(),

  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid(...typeList)
    .min(3).max(20)
    .required(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),

  phoneNumber: Joi.string().min(3).max(20),

  email: Joi.string().min(3).max(20).email().allow(null).optional(),

  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList),
});




// {
//     "name": "Kateryna Vigovska",
//     "phoneNumber": "3300555666",
//     "email": null,
//     "isFavourite": false,
//     "contactType": "personal"
//   }