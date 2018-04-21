const os = require('os');
const fs = require('fs');
const path = require('path');
const filepaths = require('./filepaths.js');
const logging = require('./logging.js')

let dbJson = filepaths.dbPath();


db = {
  readDbFile: () => {
      try {
          let file = fs.readFileSync(dbJson, 'utf8');
          return JSON.parse(file);
      } catch (e) {
          logging.error(e);
      }
    },

  writeDbFile: (dbString) => {
      try {
          let file = fs.writeFileSync(dbJson, dbString)
      } catch (e) {
          logging.error(err);
      };
    }
}


module.exports = db;
