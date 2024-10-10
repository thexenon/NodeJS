const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Tranporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2) Email options
  const mailOptions = {
    from: 'Derek Donkor <d@gmail.com>',
    to: options.emal,
    subject: options.subject,
    text: options.text
  };

  // 3) Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
