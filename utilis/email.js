const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const smtpTransport = require('nodemailer-smtp-transport')
//whenever we sent an email we use this email class like new Email(user, resetUrl).sendWelcome() //suppose when a user sign in application that method say welcome
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Hotel-HolidayHype <${process.env.EMAIL_FROM}>`;
  }

  newCreateTransport() {
    // when we are in production we actually want to send real emails using sendgrid
    //but if we are not in production in dev still we want to use mailtrap
    if (process.env.NODE_ENV === 'production') {
      // console.log('email sent for production');
      
       return nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',

        // host: 'smtp.gmail.com',
        auth: {
          user: process.env.GOOGLE_EMAIL,
          pass: process.env.GOOGLE_PASSWORD
        }
      }));
    }
    return nodemailer.createTransport({

      host: process.env.EMAIL_HOST, //there also many service like yahoo hotmail or many other
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {

    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2. Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      //text er jonno html ma text ei dibo so install html to text
      text: htmlToText.fromString(html),
      //html property also we can do later so that we can convert this message to html
    };
    //3) Create a transport and send the email
    await this.newCreateTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Holiday Hype Family!');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
  }
};
