const config = require('../config/config');

const nodemailer = require ('nodemailer');

function SendMail(email, code, base_url, app_name){
    const formattedAppname = sentenceCase(app_name);
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: config.nodemailer.host, 
        port: config.nodemailer.port, 
        secure: config.nodemailer.secure, 
        service: 'gmail',
        auth: {
            user: config.nodemailer.username,
            pass: config.nodemailer.password
        }
        })
      const urlToBeSent = `${base_url}/${email}/${code}`;
      const mailOptions = { 
          from: `${formattedAppname} <no-reply@terragonbase.com>` ,
          to: email,
          subject: 'Verify your email',
          text: "Hello, kindly click on the URL below to verify your email address and password", // plain text body
          html: `<b>Hello, kindly click on the URL below to verify your email address and password</b>, ${urlToBeSent}`, 
          };
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            reject(error);
          } else {
            resolve(info.response);
          }
        });
      })
}

const sentenceCase  = (str) => {
  if ((str===null) || (str==='')){
      return false;
  } else {
      str = str.toString().replace(/-/g, ' ');
  }
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = SendMail;