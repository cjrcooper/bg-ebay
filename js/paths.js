const os = require('os');
const path = require('path');

let home = os.homedir()
let docs = 'Documents';
let dir = 'Ebay-Results';
let db = "db.json";

paths = {
  dbPath: () => {
    return path.join(home, docs, dir, db);
  }
}

module.exports = paths;
