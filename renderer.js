var ebay = require('ebay-api');
var config = require('./config.js')
var $ = require('./lib/jquery-3.3.1.min.js')

$('#search-button').on('click', () => {
  var params = {
    keywords: ["Canon", "Powershot"],
      // add additional fields
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: 10
    },

    itemFilter: [
      {name: 'FreeShippingOnly', value: true},
      {name: 'MaxPrice', value: '150'}
    ],

    domainFilter: [
      {name: 'domainName', value: 'Digital_Cameras'}
    ]
  };

  ebay.xmlRequest({
      serviceName: 'Finding',
      opType: 'findItemsByKeywords',
      params: params,
      parser: ebay.parseResponseJson,    // (default)
      devId: config.devId,
      certId: config.certId,
      appId: config.appId,
      authToken: config.authToken,
      sandbox: true
    },
    // gets all the items together in a merged array
    function itemsCallback(error, itemsResponse) {
      if (error) throw error;

      var items = itemsResponse.searchResult.item;

      console.log('Found', items.length, 'items');
      
      for (var i = 0; i < items.length; i++) {
        console.log('- ' + items[i].title);
      }  
    }
  );
});
