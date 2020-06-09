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

const sendMail = (mail, subject, text)=>{
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

module.exports.Mailer = {
    sendBatch: (users, content)=>{
        for (var u in users){
          var email = users[u].email;
          var subject = "Thông Báo Từ Website Quản Lý Công Việc";
          var text = content + " \n " + "Truy cập: http://localhost:3001";
          sendMail(email, subject, text);
        }
    }
}

// Mailer.sendMail("dat21051999@gmail.com", "Demo", "http://localhost:3001")