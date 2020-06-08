var nodemailer = require('nodemailer');

const {OWNER_PASS, OWNER_MAIL} = require("../res/Mail.json");

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

Mailer.sendMail("dat21051999@gmail.com", "Demo", "http://localhost:3001")