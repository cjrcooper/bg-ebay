const os = require('os');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('.././config.js')


var logging = {
  error: (error) => {
      var date = new Date()
      var logError = error;
      var logErrorStack = error.stack;
      var params = (error.params === undefined ? "" : error.params);
      var log = `${date} |/ +
                 ${params} |/ +
                 ${logError} |/ +
                 ${logErrorStack}`;


      //alternative internal logging path
      var home = os.homedir()
      var dir = 'Ebay-Results';
      var docs = 'Documents';
      var logs = "logs"
      var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g,"_").replace(":", "-").replace(":", "-") + '.xslx';


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
          text: log
        };
        throw "error"

        transporter.sendMail(helperOptions, (error, info) => {
          if (error) throw error;
        });
      }
      catch (e) {
        fs.writeFile(path.join(home, docs, dir, logs, date), log, (err) => {
          return;
        })
      }
    }
}

module.exports = logging;
