const ebay = require('ebay-api');
const logging = require('./logging.js');
const config = require('.././config.js');
let searchConfiguration = require('./params.js')


let search = {
  item: (term, maxSearchResults, freeShipping, maxPrice) => {
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
          //searchingAndErrorIconsHide();
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

          let test = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' + final +'</table>';
        return test
          //$('#table tbody').html(final)
    }).catch((error) => {
      //searchingAndErrorIconsHide();
      //errorIcons();

      error.params = term;

      logging.error(error);
    });
  }
}


module.exports = search;
