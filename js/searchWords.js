const os = require('os');
const fs = require('fs');
const path = require('path');
const logging = require('./logging.js')


let home = os.homedir()
let docs = 'Documents';
let dir = 'Ebay-Results';
let db = "db.json";
let dbJson = path.join(home, docs, dir, db);


db = {
  readDbFile: () => {
      let file = fs.readFileSync(dbJson, 'utf8');
      return JSON.parse(file);
    },

  writeDbFile: (dbString) => {
      let file = fs.writeFile(dbJson, dbString, (err) => {
        logging.error(err);
      })
    }
}


module.exports = db;
