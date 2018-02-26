var ebay = require('ebay-api');
var config = require('./config.js')
var _ = require('lodash');
var $ = require('./lib/jquery-3.3.1.js')


var setKeyWords = () => {
    var keyWords = document.getElementById('search-input').value;
    var newWords = _.words(keyWords);
    return newWords
}


var setPageEntries = () => {
  return document.getElementById('number-input').value;
}


$('#search-button').on('click', () => {


  var params = {
    keywords: setKeyWords(),
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: setPageEntries()
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
      console.log(itemsResponse);


      var final = "";

      for (var i = 0; i < items.length; i++) {
        var title = '<td>' + items[i].title + '</td>';
        var price = '<td>' + '$' + items[i].sellingStatus.currentPrice.amount.toString() + '</td>'
        var shipping = '<td>' + '$' + items[i].shippingInfo.shippingServiceCost.amount.toString() + '</td>';

        final += '<tr>' + title + price + shipping + '</tr>';
        console.log('- ' + items[i].title);
      }

      console.log(final);

      $('#table tbody').html(final)
    }
  );
});
