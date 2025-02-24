import * as authServices from '../services/auth.js';
import { generateOAuthUrl } from '../utils/googleOAuth2.js';
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const user = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'Email verified',
  });
};

export const getGoogleOauthController = async (req, res) => {
   const url = generateOAuthUrl();

   res.json({
     status: 200,
     message: 'Successfully get Google OAuth url',
     data: {
       url,
     },
   });
};

export const loginWithGoogleController = async (req, res) => {
  const { code } = req.body;
  const session = await authServices.loginOrRegisterWithGoogle(code);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully login with Google OAuth',
    data: {
      accessToken: session.accessToken,
    },
  });
};



export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshToken({ refreshToken, sessionId });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refresh session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  // console.log('Received email from request body:', req.body.email);

  await authServices.sendResetEmail({ email: req.body.email });
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
