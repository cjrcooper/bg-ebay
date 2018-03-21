var ebay = require('ebay-api');
var config = require('./config.js')
var _ = require('lodash');
var $ = require('./lib/jquery-3.3.1.js')
var shell = require('electron');
var fs = require('fs');
var xl = require('excel4node');
var opn = require('opn');
var headerConfiguration = require('./params.js')
var nodemailer = require('nodemailer');



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

  if (data.length < 1) {
    return
  }

  var wb = new xl.Workbook();
  var ws = wb.addWorksheet("EbayListings");
  var iterate = 2;

  _.forEach(excelDataResults, (value) => {

    var myStyle = wb.createStyle({
    font: {
        bold: true,
        color: '#FF0800'
      }
    });

    //Row height
    ws.row(1).setHeight(20);
    ws.column(1).setWidth(25);
    ws.column(2).setWidth(60);
    ws.column(3).setWidth(15);
    ws.column(4).setWidth(15);

    //Excel Headers
    ws.cell(1, 1).string("Seller").style(myStyle);
    ws.cell(1, 2).string("Item").style(myStyle);
    ws.cell(1, 3).string("Price").style(myStyle);
    ws.cell(1, 4).string("Shipping").style(myStyle);

    //Excel Headers
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
  var date = new Date()
  var log = date + " " + error
  fs.writeFile('errorLogs.txt', log, (err) => {
    if (err) throw err;
  })
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
      user: config.email.address,
      pass: config.email.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let HelperOptions = {
    from: config.email.from,
    to: config.email.address,
    subject: 'BG-Ebay App Error',
    text: log
  };
    transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
    });
};

var searchingIcons = () => {
  $('.loader-container').css({
    "display": "block"
  })
};

var searchingAndErrorIconsHide = () => {
  $('.loader-container').css({
    "display": "none"
  })
  $('.panel-body').css({
    "display": "none"
  })
};

var clearList = () => {
  $("tbody").html("");
}

var errorIcons = () => {
  $('.panel-body').css({
    "display": "block"
  })
}

var searchItems = () => {
  new Promise((resolve, reject) => {
    var params = setSearchParamaters()
    clearList();
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
        searchingAndErrorIconsHide();
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
  }).catch((error) => {
    searchingAndErrorIconsHide();
    errorIcons();
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

$("#search-input").on('keypress', (e) => {
  if (e.which === 13) {
    if (checkEmptySearch() === true) {
      searchItems()
    }
    return;
  }
})

$('#search-button').on('click', () => {
  if (checkEmptySearch() === true) {
    searchItems()
  }
});
