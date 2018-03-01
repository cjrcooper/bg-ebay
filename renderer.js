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

var checkEmptySearch = () => {
  let searchInput = document.getElementById('search-input');
  if (!searchInput.value) {
    $('#search-input').css({
      "border":"1px solid #ff8f8f"
    })
    return
  } else {
    $('#search-input').css({
      "border":"1px solid #ced4da"
    })
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
      {name: 'MaxPrice', value: '150'}
    ]
  };

  try {
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
