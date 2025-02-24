import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.HOST_MAIL!,
    pass: process.env.HOST_MAIL_PASSWORD!,
  },
});

export default transporter;