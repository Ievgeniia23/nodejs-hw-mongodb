import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';

import *as contactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contactsSchema.js';


const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactsController.getContactsController));
  
contactsRouter.get(
  '/:id',isValidId, ctrlWrapper(contactsController.getContactByIdController),
);

contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactsController.addContactController));
  
contactsRouter.put(
  '/:id', isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactsController.upsertContactController),
);

contactsRouter.patch(
  '/:id', isValidId,
  validateBody(contactUpdateSchema),
  ctrlWrapper(contactsController.patchContactController),
);

contactsRouter.delete(
  '/:id', isValidId,
  ctrlWrapper(contactsController.deleteContactController),
);


export default contactsRouter;