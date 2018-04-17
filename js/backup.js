const moment = require('moment');
const nodemailer = require('nodemailer');
const config = require('.././config.js')
const logging = require('./logging.js')



let backup = () => {
  try {
    let date = moment().format();
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 25,
      auth: {
        user: config.email.address,
        pass: config.email.password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    let helperOptions = {
      from: config.email.from,
      to: config.email.address,
      subject: 'BG-Ebay DB Update',
      text: `${date}`,
      attachments: [{
        filname: `${}`
      }]
    };

    transporter.sendMail(helperOptions, (error, info) => {
      if (error) throw error;
    });
  }
  catch (e) {
    logging.error(e)
  }
}


module.exports = backup