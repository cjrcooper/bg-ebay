const os = require('os');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const ebay = require('ebay-api');
const moment = require('moment');
const xl = require('excel4node');
const shell = require('electron');
const db = require('./js/db.js');
const init = require('./js/init.js');
const config = require('./config.js');
const terms = require('./js/terms.js')
const search = require('./js/search.js');
const $ = require('./lib/jquery-3.3.1.js');
const logging = require('./js/logging.js');
const filepaths = require('./js/filepaths.js')
const writeToExcel = require('./js/writeToExcel');





     $(document).ready(function () {


       let dataResults = db.readDbFile();
       let dataSection = [];

      _.forEach(dataResults.terms, (results)  => {
        dataSection.push(results);
      })

         var table = $('#example').DataTable({
             "data": dataSection,
             select:"single",
             "columns": [
                 {
                     "className": 'details-control',
                     "orderable": false,
                     "data": null,
                     "defaultContent": '',
                     "render": function () {
                         return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                     },
                     width:"15px"
                 },
                 { "data": "term" },
                 { "data": "maxSearchResults" },
                 { "data": "freeShipping" },
                 { "data": "maxPrice" },
                 {
                   "className": 'playButton',
                   "orderable": false,
                   "defaultContent": '',
                   "render": function () {
                     return '<i class="fas fa-play-circle"></i>'
                   }

                 }
             ],
             "order": [[1, 'asc']]
         });

         // Add event listener for opening and closing details
         $('#example tbody').on('click', 'td.details-control', function () {
             let tr = $(this).closest('tr');
             let tdi = tr.find("i.fa");
             let row = table.row(tr);

             if ( row.child.isShown() ) {
                  row.child.hide();
                  tr.removeClass('shown');
             } else {
                  row.child( format(row.data()) ).show();
                  tr.addClass('shown');
             }
         });

         table.on("user-select", function (e, dt, type, cell, originalEvent) {
             if ($(cell.node()).hasClass("details-control")) {
                 e.preventDefault();
             }
         });
     });


     function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
                '<td>Full name:</td>'+
                '<td>'+d.name+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Extension number:</td>'+
                '<td>'+d.extn+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Extra info:</td>'+
                '<td>And any further details here (images etc)...</td>'+
            '</tr>'+
        '</table>';
    }


init.createDirectories();
init.createFiles();

//$('#new-content-container').hide();
//$('#search-container').hide();


var excelDataResults = [];

var setKeyWords = () => {
    return document.getElementById('search-input').value;
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

$(document).on('click', 'a[href^="http"]', function(e) {
    e.preventDefault();
    shell.shell.openExternal(this.href);
});

$('#excel-download').on('click', () => {
  try {
    let excelDoc = writeToExcel.createExcel(excelDataResults);
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

        return final

        //$('#table tbody').html(final)
  }).catch((error) => {
    searchingAndErrorIconsHide();
    errorIcons();

    error.params = searchTerms;

    logging.error(error);
  });
};




// Update the search terms file
$(document).ready(function() {


  //term, maxSearchResults, freeShipping, maxPrice
  terms.add("watermelon", 15, false, 200);

  // terms.update("orange", 20, false, 50);

  // terms.delete("orange");

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
