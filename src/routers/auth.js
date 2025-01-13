import { Router } from "express";

import * as authController from "../controllers/auth.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { validateBody } from "../middlewares/validateBody.js";

import { authUserSchema, authLoginSchema } from "../validation/auth.js";



const authRouter = Router();


authRouter.post("/register", validateBody(authUserSchema), ctrlWrapper(authController.registerController));

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(authController.loginController));


export default authRouter;

