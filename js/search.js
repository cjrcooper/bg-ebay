const ebay = require('ebay-api');
const logging = require('./logging.js');
const config = require('.././config.js');
let searchConfiguration = require('./params.js')
let searchResults = require('./results.js');


let search = {
  item: (term, maxSearchResults, freeShipping, maxPrice) => {
    console.log(term, maxSearchResults, freeShipping, maxPrice);
    
    
    let searchTerms;

    new Promise((resolve, reject) => {

      //Add the search params to the configuration
      searchConfiguration.params.keywords = term
      searchConfiguration.params.itemFilter.push({  
        name: 'FreeShippingOnly', value: freeShipping,
        name: 'MaxPrice', value: maxPrice
      })
      searchConfiguration.params.paginationInput = maxSearchResults

      const params = searchConfiguration;

      errorTerm = params;

     ebay.xmlRequest(params, (error, itemsResponse) => {
          if (itemsResponse.ack === "Success") {
            resolve(itemsResponse);
          } else {
            reject(error);
          }
      });
    }).then((itemsResponse) => {
        return searchResults.constructTable(itemsResponse, term, maxSearchResults, freeShipping, maxPrice);
    }).catch((error) => {
      //searchingAndErrorIconsHide();
      //errorIcons();

      error.params = term;

      logging.error(error);
    });
  }
}


module.exports = search;
