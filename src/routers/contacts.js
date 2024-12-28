import {Router} from 'express';

import *as сontactsController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(сontactsController.getContactsController));
  
contactsRouter.get('/:id', ctrlWrapper(сontactsController.getContactByIdController));

contactsRouter.post('/', ctrlWrapper(сontactsController.addContactController));
  
contactsRouter.put('/:id', ctrlWrapper(contactsController.upserContactController));

contactsRouter.patch('/:id', ctrlWrapper(contactsController.patchContactController));

contactsRouter.delete(
  '/:id',
  ctrlWrapper(contactsController.deleteContactController),
);


export default contactsRouter;