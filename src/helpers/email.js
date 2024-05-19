const nodemailer = require('nodemailer');

const sendEmail = async (userList, subject, body) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  for (const user of userList.users) {
    let personalizedBody = body;
    userList.customProperties.forEach(prop => {
      const value = user.customProperties.get(prop.title);
      personalizedBody = personalizedBody.replace(`[${prop.title}]`, value);
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject,
      text: personalizedBody
    };

    await transporter.sendMail(mailOptions);
  }
};

module.exports = { sendEmail };
