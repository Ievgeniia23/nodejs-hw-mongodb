import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  authUserSchema,
  authLoginSchema,
  resetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';


const authRouter = Router();

authRouter.post("/register", validateBody(authUserSchema), ctrlWrapper(authController.registerController));

authRouter.get("/verify", ctrlWrapper(authController.verifyController));

authRouter.post("/login", validateBody(authLoginSchema), ctrlWrapper(authController.loginController));

authRouter.post("/refresh", ctrlWrapper(authController.refreshTokenController));

authRouter.post("/logout",ctrlWrapper(authController.logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(authController.sendResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authController.resetPasswordController),
);

export default authRouter;

