const ebay = require('ebay-api');
const _ = require('lodash');
const os = require('os');
const shell = require('electron');
const fs = require('fs');
const xl = require('excel4node');
const opn = require('opn');
const path = require('path');
const moment = require('moment');
const init = require('./js/init.js');
const config = require('./config.js');
const logging = require('./js/logging.js');
const $ = require('./lib/jquery-3.3.1.js')
const searchWords = require('./js/searchWords');



init.createDirectories();
init.createFiles();

$('#search-container').hide();


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

  var home = os.homedir()
  var dir = 'EbaySearchResults';
  var date = moment().format('DD-MM-YY-hh_mm_ss') + '.xslx';
  var logpath = path.join(home, 'Documents', dir, date);

  wb.writeToBuffer().then((buffer) => {
    try {
      fs.writeFileSync(logpath, buffer, (err) => {
        if (err) {
          logging.error(err);
        }
      })
      opn(logpath);
    } catch(e) {
      logging.error(e);
    }
  });
};

$(document).on('click', 'a[href^="http"]', function(e) {
    e.preventDefault();
    shell.shell.openExternal(this.href);
});

$('#excel-download').on('click', () => {
  try {
    downloadExcel(excelDataResults);
  } catch (e) {
    logging.error(e);
  }
});


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

  var searchTerms;

  new Promise((resolve, reject) => {
    var params = setSearchParamaters()
    clearList();
    searchingAndErrorIconsHide();
    searchingIcons();

    searchTerms = params;

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

    error.params = searchTerms;

    logging.error(error);
  });
};



// $(document).ready(function(){
//    var i=1;
//   $("#add_row").click(function(){
//      $('#addr'+i).html("<td>"+ (i+1) +"</td><td><input name='name"+i+"' type='text' placeholder='Name' class='form-control input-md'  /> </td>");
//        $('#tab_logic').append('<tr id="addr'+(i+1)+'"></tr>');
//         i++;
//       });
//       $("#delete_row").click(function(){
//         if(i>1){
//           $("#addr"+(i-1)).html('');
//           i--;
//     }
//   });
// });



// Update the search terms file
$(document).ready(function() {
  let words = searchWords.readDbFile();
  console.log(words.terms.banana);
  //
  // $("#tab_logic tbody").append();
})





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
