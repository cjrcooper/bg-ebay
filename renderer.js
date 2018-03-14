var ebay = require('ebay-api');
var config = require('./config.js')
var _ = require('lodash');
var $ = require('./lib/jquery-3.3.1.js')


var setKeyWords = () => {
    let keyWords = document.getElementById('search-input').value;
    let newWords = _.words(keyWords);
    return newWords
}

var setPageEntries = () => {
  return document.getElementById('number-input').value;
}

var freeShippingOnly = () => {
  return document.getElementById('free-shipping').checked;
}

var setMaxPrice = () => {
  return document.getElementById('max-price-input').value;
}

var checkEmptySearch = () => {
  let searchInput = document.getElementById('search-input');
  if (!searchInput.value) {
    searchInput.classList.add('search-error')
  } else {
    searchInput.classList.remove('search-error')
    searchInput.classList.add('search-highlight')
  }
}


$('#search-button').on('click', () => {

  checkEmptySearch();

  var params = {
    keywords: setKeyWords(),
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: setPageEntries()
    },

    itemFilter: [
      {name: 'FreeShippingOnly', value: freeShippingOnly()},
      {name: 'MaxPrice', value: setMaxPrice()}
    ]
  };

  try {
    if (document.getElementById('search-input').value.length < 1) {
      throw 'Empty'
    }

    ebay.xmlRequest({
        serviceName: 'Finding',
        opType: 'findItemsByKeywords',
        reqOptions: {
          headers: {
              'X-EBAY-SOA-GLOBAL-ID': 'EBAY-AU'
          }
        },
        params: params,
        parser: ebay.parseResponseJson,    // (default)
        devId: config.production.devId,
        certId: config.production.certId,
        appId: config.production.appId,
        authToken: config.production.authToken,
        sandbox: false
      },
      // gets all the items together in a merged array
      function itemsCallback(error, itemsResponse) {
        if (error) throw error;

        console.log(itemsResponse)

        var items = itemsResponse.searchResult.item;
        var final = "";

        for (var i = 0; i < items.length; i++) {
          var title = '<td>' + items[i].title + '</td>';
          var price = '<td>' + '$' + items[i].sellingStatus.currentPrice.amount.toString() + '</td>'
          var shipping = '<td>' + '$' + items[i].shippingInfo.shippingServiceCost.amount.toString() + '</td>';

          final += '<tr>' + title + price + shipping + '</tr>';
        }
        $('#table tbody').html(final)
      }
    );
  } catch (e) {
    console.log(e)
  }
});
