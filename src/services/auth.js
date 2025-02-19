import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';

import { sendEmail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constans/users.js';
import { TEMPLATES_DIR } from '../constans/index.js';
// import { log } from 'node:console';

const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');

const emailTemplateSourse = await readFile(emailTemplatePath, 'utf-8');

const appDomain = getEnvVar('APP_DOMAIN');

// console.log(process.env);
const jwtSecret = getEnvVar('JWT_SECRET');

// console.log('JWT_SECRET:', jwtSecret);

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenLifetime,
  refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });

  // console.log('User found:', user);
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  const template = Handlebars.compile(emailTemplateSourse);

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });

  const html = template({
    link: `${appDomain}/auth/verify?token=${token}`,
  });

  const verifyEmail = {
    from: getEnvVar('SMTP_USER'),
    to: email,
    subject: 'Verify email',
    html,
  };

  await sendEmail(verifyEmail);

  return newUser;
};

export const sendResetEmail = async ({ email }) => {
  // console.log('Підготовка до відправки листа для:', email);

  // console.log('Looking for user with email:', email);

  // console.log('Received email:', email);

  const user = await UserCollection.findOne({ email });

  // console.log('User found:', user);

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: '5m' });

  const resetLink = `${appDomain}/reset-password?token=${resetToken}`;

  const resetEmail = {
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  };

  try {
    await sendEmail(resetEmail);
  } catch (error) {
    throw createHttpError(
      500,
      `Failed to send the email, please try again later: ${error.message}`,
    );
  }

  return {
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  };
};

export const verify = async (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);
    const user = await UserCollection.findOne({ email });

    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });

  console.log('User found:', user);

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // if (!user.verify) {
  //   throw createHttpError(401, 'Email not verified');
  // }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password invalid');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const resetPassword = async ({ token, password }) => {
  let email;

  try {
    const payload = jwt.verify(token, jwtSecret);
    email = payload.email;
  } catch (error) {
    throw createHttpError(401, `Token is expired or invalid: ${error.message}`);
  }

  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: hashedPassword },
  );

  await SessionCollection.deleteMany({ userId: user._id });

  return {
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  };
};

export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'RefreshToken is expired');
  }

  await SessionCollection.deleteOne({ id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getUser = (filter) => UserCollection.findOne(filter);

export const getSession = (filter) => SessionCollection.findOne(filter);
