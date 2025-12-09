const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await mailTransport.sendMail({ to, subject, text, html });
    return { emailSent: true, error: null };
  } catch (e) {
    console.error('NODEMAILER ERROR:\n', e);
    return { emailSent: false, error: e };
  }
};

module.exports = { sendEmail }