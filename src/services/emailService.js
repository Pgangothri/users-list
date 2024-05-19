const nodemailer = require('nodemailer');

// Configure your email service provider
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass
}})