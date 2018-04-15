const fs = require('fs');
const os = require('os');
const logging = require('./logging.js')
const path = require('path');

let home = os.homedir()
let docs = 'Documents';
let dir = 'Ebay-Results';
let logs = "logs"
let db = "db.json";


var init = {
  createDirectories: () => {
    //Creates the Results directory
    let resultsDirectory = path.join(home, docs, dir);
    if (!fs.existsSync(resultsDirectory)) {
      fs.mkdirSync(resultsDirectory, (e) => {
        logging.error(e);
      })
    }

    //Creates the logging directory
    let logDirectory = path.join(home, docs, dir, logs);
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, (e) => {
        logging.error(e);
      })
    }
  },

  createFiles: () => {
    //Creates the db.json file
    let dbJson = path.join(home, docs, dir, db);
    if (!fs.existsSync(dbJson)) {
      fs.writeFile(dbJson, (e) => {
        logging.error(e);
      })
    }
  }
}

module.exports = init;
