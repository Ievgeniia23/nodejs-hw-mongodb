import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';



import *as contactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';

import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contactsSchema.js';


const contactsRouter = Router();

contactsRouter.use(authenticate);


contactsRouter.get('/', ctrlWrapper(contactsController.getContactsController));
  
contactsRouter.get(
  '/:id',isValidId, ctrlWrapper(contactsController.getContactByIdController),
);

contactsRouter.post('/', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactsController.addContactController));
  
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