const fs = require('fs');
const os = require('os');
const logging = require('./logging.js')
const path = require('path');

var init = {
  createDirectories: () => {

    var home = os.homedir()
    var dir = 'Ebay-Results';
    var docs = 'Documents';
    var logs = "logs"

    //Creates the results directory
    if (!fs.existsSync(path.join(home, docs, dir))) {
      fs.mkdirSync(path.join(home, docs, dir), (e) => {
        logging.error(e);
      })
    }

    //Creates the logging directory
    if (!fs.existsSync(path.join(home, docs, dir, logs))) {
      fs.mkdirSync(path.join(home, docs, dir, logs), (e) => {
        logging.error(e);
      })
    }
  }
}

module.exports = init;
