import nodemailer from 'nodemailer-promise';
import dotenv from 'dotenv';

dotenv.config();

const {
  MAILER_USER,
  MAILER_PASS,
} = process.env;

const mailer = nodemailer.config({
  from: 'the-remotants@gmail.com',
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  transportMethod: 'SMTP',
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASS,
  },
});

export default mailer;
