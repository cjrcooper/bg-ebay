const fs = require('fs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const config = require('.././config.js');
const filepaths = require('./filepaths.js');
const logging = require('./logging.js');



let backup = (item) => {
  try {
    let date = moment();
    let file = date.format('DD-MM-YY-hh_mm_ss');

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
      subject: 'BG-Ebay DB Backup',
      text: `${date} / 
      ${item}`,
      attachments: [{
        filname: `${file}.json`,
        path: filepaths.dbPath()
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
