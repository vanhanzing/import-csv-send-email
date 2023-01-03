const nodemailer = require('nodemailer');
require('dotenv/config');

mailers = {
  local: {
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  },

  production: {
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    debug: true,
    secureConnection: true,
  },
};

const makeMailer = (mConf) => {
  const mailer = nodemailer.createTransport(
    mailers[mConf] || mailers[process.env.ENV]
  );
  return mailer;
};

module.exports = makeMailer;
