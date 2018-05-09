const os = require('os');
const path = require('path');
const moment = require('moment');

let home = os.homedir()
let docs = 'Documents';
let dir = 'Ebay-Results';
let log = "logs";
let db = "db.json";
let search = "search.json";
let date = moment().format('DD-MM-YY-hh_mm_ss');
let xl = date + '.xlsx';


filepaths = {
  mainPath: () => {
    return path.join(home, docs, dir);
  },

  resultsPath: () => {
    return path.join(home, docs, dir, xl);
  },

  dbPath: () => {
    return path.join(home, docs, dir, db);
  },

  searchPath: () => {
    return path.join(home, docs, dir, search);
  },

  logPath: () => {
    return path.join(home, docs, dir, log);
  }
}

module.exports = filepaths;
