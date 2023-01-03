require('dotenv/config');

const sendEmail = async (user, mailer, month, template) => {
  var mailOptions = {
    from: `"Hr" <${process.env.EMAIL_FROM}>`,
    to: user['Email'],
    subject: `Salary slip of ${month}`,
    template: template, // the name of the template file i.e email.handlebars
    context: {
      month: month,
      name: user['Name of the Employee'],
      email: user['Email'],
      postion: user['Position'],
      panNumber: user['PAN Number'],
      accountNo: user['Account No.'],
      workingDays: user['W.D.'],
      payableDays: user['P.D.'],
      grossSalary: user['Gross salary'],
      basicSalary: user['Basic Salary'],
      lumpSum: user['Lumpsum Allowance'],
      beforeTDS: user['Salary Before TDS'],
      pfContribution: user['PF Contribution'],
      overTimeDays: user['Overtime Days'],
      overTimePay: user['OT Amount'],
      byodIncentive: user['BYOD Incentive'],
      negativeDays: user['Negative Days'],
      amount: user['Amount'],
      citDeduction: user['CIT Deduction'],
      pfDeduction: user['PF Deduction'],
      totalTaxDeduction: user['Total Tax Deduction'],
      adjustment: user['Adjustment'],
      netSalary: user['Net Salary'],
    },
  };
  let info = await mailer.sendMail(mailOptions);

  return info;
};

module.exports = { sendEmail };
