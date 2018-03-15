var ebay = require('ebay-api');
var config = require('./config.js')
var _ = require('lodash');
var $ = require('./lib/jquery-3.3.1.js')
var shell = require('electron');
var fs = require('fs');
var xl = require('excel4node');


var excelDataResults = [];


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


var downloadExcel = (data) => {
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("EbayListings");
  var iterate = 1;

  _.forEach(excelDataResults, (value) => {
    ws.cell(1,iterate).string(value[0])
    ws.cell(2,iterate).string(value[1])
    ws.cell(3,iterate).number(value[2])
    ws.cell(4,iterate).number(value[3])
    console.log("test");
    iterate++;
  })
  wb.write('Excel.xlsx');
  var path = "Excel.xlsx";
  fs.open(path, 'r+', (err, fd) => {
    if(err) {
      console.log(err);
    }
  })
  console.log(`${process.cwd()}/Excel.xlsx`)
}



$(document).on('click', 'a[href^="http"]', function(e) {
    e.preventDefault();
    shell.shell.openExternal(this.href);
});

$('#excel-download').on('click', () => {
  downloadExcel(excelDataResults);
})

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
    ],

    outputSelector: "SellerInfo"
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
        resultList = [];

        for (var i = 0; i < items.length; i++) {

          var sellerData = items[i].sellerInfo.sellerUserName;
          var titleData = items[i].title;
          var priceData = items[i].sellingStatus.currentPrice.amount;
          var shippingData = items[i].shippingInfo.shippingServiceCost.amount;
          var linkData = items[i].viewItemURL;


          var seller = '<td>' + sellerData + '</td>';
          var title = '<td>' + titleData + '</td>';
          var price = '<td>' + '$' + priceData.toString() + '</td>'
          var shipping = '<td>' + '$' + shippingData.toString() + '</td>';
          var link = '<td><a href="' + linkData + '" target="_blank"><i class="fas fa-external-link-alt"></i></a></td>'

          var excelDataRow = [sellerData, titleData, priceData, shippingData];
          excelDataResults.push(excelDataRow)

          final += '<tr>' + seller + title + price + shipping + link + '</tr>';
        }
        $('#table tbody').html(final)
        console.log(excelDataResults);
      }
    );
  } catch (e) {
    console.log(e)
  }
});
