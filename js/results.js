const logging = require('./logging.js');
const terms = require('./terms.js');

let searchResults = {
  constructTable: (itemsResponse, term, maxSearchResults, freeShippingOnly, maxPrice) => {
    //searchingAndErrorIconsHide();
    let items = itemsResponse.searchResult.item;
    let result = "";
    excelDataResults = [];

    for (let i = 0; i < items.length; i++) {

      //Extract data from response
      let sellerData = items[i].sellerInfo.sellerUserName;
      let titleData = items[i].title;
      let priceData = items[i].sellingStatus.currentPrice.amount;
      let shippingData = items[i].shippingInfo.shippingServiceCost.amount;
      let linkData = items[i].viewItemURL;


      //Contatonate strings
      let seller = '<td>' + sellerData + '</td>';
      let title = '<td>' + titleData + '</td>';
      let price = '<td>' + '$' + priceData.toString() + '</td>'
      let shipping = '<td>' + '$' + shippingData.toString() + '</td>';
      let link = '<td><a href="' + linkData + '" target="_blank"><i class="fas fa-external-link-alt"></i></a></td>'


      //Place strings in a array for extraction
      let excelDataRow = [sellerData, titleData, priceData, shippingData];
      excelDataResults.push(excelDataRow)

      //Add each row to the final string
      result += '<tr>' + seller + title + price + shipping + link + '</tr>';
    }

    let table = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' + result +'</table>';
    terms.update(term, maxSearchResults, freeShippingOnly, maxPrice, table);
    
    return;
  }
};


module.exports = searchResults;
