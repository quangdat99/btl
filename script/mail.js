var nodemailer = require('nodemailer');

const OWNER_MAIL = 'doankjwj97@gmail.com';
const OWNER_PASS = '0982371807';

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  service: 'gmail',
    auth: {
        user: OWNER_MAIL,
        pass: OWNER_PASS
    }
});


module.exports = Mailer = {
    sendMail: (mail, subject, text)=>{
      var mailOptions = {
        from: OWNER_MAIL,
        to: mail,
        subject: subject,
        text: text
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('Failed to send Mail');
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }
}