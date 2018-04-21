const os = require('os');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const nodemailer = require('nodemailer');
const filepaths = require('./filepaths.js');
const config = require('.././config.js');


var logging = {
  error: (error) => {
      let date = new Date()
      let logError = error;
      let logErrorStack = (error.stack === undefined ? "" : error.stack);
      let params = (error.params === undefined ? "" : error.params);
      let logMessage = `${date} |/ +
                 ${params} |/ +
                 ${logError} |/ +
                 ${logErrorStack}`;

      
      let logPath = filepaths.logPath();


      try {
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
          subject: 'BG-Ebay App Error',
          text: logMessage
        };

        transporter.sendMail(helperOptions, (error, info) => {
          if (error) throw error;
        });
      }
      catch (e) {
        fs.writeFile(logPath, log, (err) => {
          return; //Add some functionality to expose a critical error to the user
        })
      }
    }
}

module.exports = logging;
