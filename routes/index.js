const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const makeMailer = require('../config/mail');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const sendEmail = require('../middleware/sendEmail');

router.post('/users', async (req, res) => {
  let sampleFile;

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.render('dashboard/dashboard', {
        error_msg: 'No files were uploaded.',
      });
    }
    sampleFile = req.files.sampleFile;

    const json = await csv({
      ignoreEmpty: true,
    }).fromString(sampleFile.data.toString('utf8'));

    return res.render('dashboard/userlist', {
      suceess_msg: 'Extracted Sucessfully',
      data: json,
      emailData: JSON.stringify(json),
      headers: Object.keys(json[0]),
    });
  } catch (err) {
    console.log(err);
    res.render('dashboard/dashboard', {
      error_msg: 'DB error',
    });
  }
});

router.post('/send-email', async (req, res) => {
  let { emailList } = req.body;
  emailList = JSON.parse(emailList);

  try {
    const mailer = makeMailer();
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
      },
      viewPath: path.resolve('./views/layout/'),
    };

    // use a template file with nodemailer
    mailer.use('compile', hbs(handlebarOptions));
    const current = new Date();
    current.setMonth(current.getMonth() - 1);
    const previousMonth = current.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    const emailInfo = [];

    for (user of emailList) {
      let info = await sendEmail.sendEmail(
        user,
        mailer,
        previousMonth,
        'payslip'
      );

      let data = {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
        messageId: info.messageId,
      };
      emailInfo.push(data);
    }

    return res.render('dashboard/report', {
      data: emailInfo,
    });
  } catch (err) {
    console.log(err);
    res.render('/', {
      error_msg: 'DB error',
    });
  }
});

/** report page */
router.get('/report', (req, res) => {
  return res.render('dashboard/report', {
    sucsess_msg: 'Email sucessfully sent',
  });
});

module.exports = router;
