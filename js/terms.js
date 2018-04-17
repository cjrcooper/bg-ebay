const _ = require('lodash');
const db = require('./db.js');
const backup = require('./backup.js');
const logging = require('./logging.js');


terms = {
  add: (term, maxSearchResults, freeShipping, maxPrice) => {
    try {

      //Call the db
      let dbFile = db.readDbFile();
      let totalCountId = dbFile.totalCountId;


      //Check if term already exists
      let findTerm = _.find(dbFile.terms, term)
      if (findTerm === undefined) {

        dbFile.terms[term] = {
          "id": totalCountId + 1,
          "term": term,
          "maxSearchResults": maxSearchResults,
          "freeShipping": freeShipping,
          "maxPrice": maxPrice
        }

        //Update ID and total values
        dbFile.totalCountId++
        dbFile.totalTerms = _.size(dbFile.terms) + 1;


        //Parse the new entry and write it to the DB
        let addNewEntry = JSON.stringify(dbFile);
        db.writeDbFile(addNewEntry);


        //Add the code to email the backupDB
        backup();
      }

    } catch (e) {
      logging.error(e);
    }
  },





  update: (term, maxSearchResults, freeShipping, maxPrice) => {
    try {

      let dbFile = db.readDbFile();

      //Update the search terms etc etc
      dbFile.terms[term].maxSearchResults = maxSearchResults
      dbFile.terms[term].freeShipping = freeShipping
      dbFile.terms[term].maxPrice = maxPrice;

      //Parse the new entry and write it to the DB
      let addNewEntry = JSON.stringify(dbFile);
      db.writeDbFile(addNewEntry);


      //Add the code to email the backupDB
    } catch (e) {
      logging.error(e)
    }
  },




  delete: (term) => {
    try {

      //Call the db
      let dbFile = db.readDbFile();


      delete dbFile.terms[term]

      //Update ID and total values
      dbFile.totalCountId--
      dbFile.totalTerms = _.size(dbFile.terms) - 1;


      //Parse the new entry and write it to the DB
      let addNewEntry = JSON.stringify(dbFile);
      db.writeDbFile(addNewEntry);


      //Add the code to email the backupDB
    } catch (e) {
      logging.error(e);
    }
  },
}

module.exports = terms;
