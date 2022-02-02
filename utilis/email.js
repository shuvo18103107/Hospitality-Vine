const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const smtpTransport = require('nodemailer-smtp-transport')
//whenever we sent an email we use this email class like new Email(user, resetUrl).sendWelcome() //suppose when a user sign in application that method say welcome
module.exports = class Email {
  constructor(user, url) {
    console.log(user,url)
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mohammad Ali Shuvo <${process.env.EMAIL_FROM}>`;
  }

  newCreateTransport() {
    // when we are in production we actually want to send real emails using sendgrid
    //but if we are not in production in dev still we want to use mailtrap
    if (process.env.NODE_ENV === 'production') {
      console.log('email sent for production');
      
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
      //1. create a transporter - it is a service that actually send the email cg its not nodejs , we use service like gmail

      //gmail use na kore amra ekta service use korci user ke mail pathanor jonno , we use mailtrap for testing this
      //here we pass some options
      host: process.env.EMAIL_HOST, //there also many service like yahoo hotmail or many other
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      //so here we use nodemailer with mailtrap for safely test sending email
      //we will not use gmail in this application cg gmail is not a good idea in production app cg using gmail we send 500 emails per day and also u can quickly mark as spammer
      //so we should use sentgrid or mailgurd and we use this later
      //right now we use a special development service mailtrap which usually send faked email to the client but this email never reached to the client it is trapped in maitrap ,so that we cannot accedently send dev email to your clients,for testing purpous it is best
    });
  }
  // now this send method recieve a template and a subject by calling this send method we send diff template and diff message to the user based on situation
  async send(template, subject) {
    //1) Render HTML based on pug template
    // as far we normally create the template and render the template using res.render('templatename) and in background it form into html and show in the client side but now we actually create html out of the template so that we send html as an email output
    //pug to html
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
