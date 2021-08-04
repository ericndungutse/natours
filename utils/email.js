const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Eric Ndungutse <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // 1) Create a transporter: A service that send Email (Gmail, SendGrid)
    if (process.env.NODE_ENV.trim() === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the Actual Email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject: this.subject,
      }
    );

    // 2)Define Email Options
    const mailOptions = {
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    if (process.env.NODE_ENV.trim() === 'development') {
      mailOptions.from = this.from;
    } else {
      mailOptions.from = 'Natours <eric.tuyizere.ndungutse@gmail.com>';
    }

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset link (Valid for only 10 munites'
    );
  }
};

// const sendEmail = async (options) => {
//   // 1) Create a transporter: A service that send Email (Gmail, SendGrid)
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   // 2) Define email Options
//   const mailOptions = {
//     from: 'Eric Ndungutse <eric.ndungutse@natours.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: `<a href="#"> Reset Password</a>`,
//   };

//   // 3) Send Email.
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
