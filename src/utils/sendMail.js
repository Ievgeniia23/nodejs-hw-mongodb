import nodemailer from 'nodemailer';

import { SMTP } from '../constans/index.js';

import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});

// export const sendEmail = async (options) => {
//   try {
//     return await transporter.sendMail(options);
//   } catch (err) {
//     console.error(err);
//     throw createHttpError(500, "Failed to send an email"); 
// }
// };


export const sendEmail = async (options) => {
  try {
    console.log('Налаштування для відправки:', options);
    const result = await transporter.sendMail(options);
    console.log('Лист успішно відправлено:', result);
    return result;
  } catch (err) {
    console.error('Помилка при відправці:', err);
    throw createHttpError(500, 'Failed to send an email');
  }
};
