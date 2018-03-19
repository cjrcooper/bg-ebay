var ebay = require('ebay-api');
var config = require('./config.js')
var _ = require('lodash');
var $ = require('./lib/jquery-3.3.1.js')
var shell = require('electron');
var fs = require('fs');
var xl = require('excel4node');
var opn = require('opn');
var headerConfiguration = require('./params.js')


var excelDataResults = [];


var setKeyWords = () => {
    let keyWords = document.getElementById('search-input').value;
    let newWords = _.words(keyWords);
    return newWords
};

var setPageEntries = () => {
  return document.getElementById('number-input').value;
};

var freeShippingOnly = () => {
  return document.getElementById('free-shipping').checked;
};

var setMaxPrice = () => {
  return document.getElementById('max-price-input').value;
};

var checkEmptySearch = () => {
  let searchInput = document.getElementById('search-input');
  if (!searchInput.value) {
    searchInput.classList.add('search-error');
    return false;
  } else {
    searchInput.classList.remove('search-error');
    searchInput.classList.add('search-highlight');
    return true;
  }
};

var downloadExcel = (data) => {
  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("EbayListings");
  var iterate = 1;

  _.forEach(excelDataResults, (value) => {
    ws.cell(iterate,1).string(value[0])
    ws.cell(iterate,2).string(value[1])
    ws.cell(iterate,3).number(value[2])
    ws.cell(iterate,4).number(value[3])
    iterate++;
  })
  wb.write('Excel.xlsx');
  var path = "Excel.xlsx";
  opn(path);
};



$(document).on('click', 'a[href^="http"]', function(e) {
    e.preventDefault();
    shell.shell.openExternal(this.href);
});




$('#excel-download').on('click', () => {
  try {
    downloadExcel(excelDataResults);
  } catch (e) {
    errorLogging(e);
  }
});

var errorLogging = (error) => {
  fs.writeFile('errorLogs', error, (err) => {
    if (err) throw err;
  })
};

var searchingIcons = () => {
  var spinner = '<div class="loader-container"><div class="loader"></div></div>'
  $('#table tbody').html(spinner);
};


var searchItems = () => {
  new Promise((resolve, reject) => {
    var params = setSearchParamaters()
    searchingIcons();

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
      }, (error, itemsResponse) => {
        if (itemsResponse.ack === "Success") {
          resolve(itemsResponse);
        } else {
          reject(error);
        }
    });
  }).then((itemsResponse) => {
        var items = itemsResponse.searchResult.item;
        var final = "";
        excelDataResults = [];

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
  }).catch((error) => {
    console.log(error);
    errorLogging(error);
  });
};





var setSearchParamaters = () => {
    var config = {
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
    return config;
}



$('#search-button').on('click', () => {
  if (checkEmptySearch() === true) {
    searchItems()
  }
    return;
});
