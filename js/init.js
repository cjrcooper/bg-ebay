const fs = require('fs');
const os = require('os');
const path = require('path');
const logging = require('./logging.js');
const filepaths = require('./filepaths.js');



var init = {
  createDirectories: () => {
    //Creates the Results directory
    let resultsDirectory = filepaths.resultsPath();
      try {
        if (!fs.existsSync(resultsDirectory)) {
          fs.mkdirSync(resultsDirectory)
        }
      } catch (e) {
        logging.error(e);
      }

    //Creates the logging directory
    let logDirectory = filepaths.logPath();
      try {
        if (!fs.existsSync(logDirectory)) {
          fs.mkdirSync(logDirectory);
        }
      } catch (e) {
        logging.error(e);
      }
  },

  createFiles: () => {
    //Creates the db.json file
    let dbJson = filepaths.dbPath();
      try {
        if (!fs.existsSync(dbJson)) {
          fs.writeFileSync(dbJson);
        }
      } catch (e) {
        logging.error(e);
      }
    }
}

module.exports = init;
