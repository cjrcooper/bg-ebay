const fs = require('fs');
const os = require('os');
const path = require('path');
const logging = require('./logging.js');
const filepaths = require('./filepaths.js');



var init = {
  createDirectories: () => {
    //Creates the Results directory
    let resultsDirectory = filepaths.mainPath();
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
    let dbData = '{"terms": {},"totalCountId": 0,"totalTerms": 0}';
    let dbJson = filepaths.dbPath();
      try {
        if (!fs.existsSync(dbJson)) {
          fs.writeFileSync(dbJson, dbData);
        }
      } catch (e) {
        logging.error(e);
      }

    //Creates the search.json file
    let searchData = '{}';
    let searchJson = filepaths.searchPath();
      try {
        if (!fs.existsSync(searchJson)) {
          fs.writeFileSync(searchJson, searchData);
        }
      } catch (e) {
        logging.error(e);
      }
    }
}

module.exports = init;
