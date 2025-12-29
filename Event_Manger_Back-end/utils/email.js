// utils/email.js
const nodemailer = require('nodemailer');

// Create reusable transporter using Ethereal (fake SMTP)
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = await createTestAccount();
    const info = await transporter.sendMail({
      from: '"EventPro" <no-reply@eventpro.test>',
      to,
      subject,
      html,
    });
    console.log('📧 Preview email:', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error('📧 Email error:', err.message);
  }
};

module.exports = { sendEmail };