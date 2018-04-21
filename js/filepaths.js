const os = require('os');
const path = require('path');
const moment = require('moment');

let home = os.homedir()
let docs = 'Documents';
let dir = 'Ebay-Results';
let log = "logs";
let db = "db.json";
let date = moment().format('DD-MM-YY-hh_mm_ss');
let xl = date + '.xslx';


filepaths = {
  resultsPath: () => {
    return path.join(home, docs, dir);
  },
  
  dbPath: () => {
    return path.join(home, docs, dir, db);
  },
  
  logPath: () => {
    return path.join(home, docs, dir, log, xl);
  }
}

module.exports = filepaths;
