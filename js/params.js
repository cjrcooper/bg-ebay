const ebay = require('ebay-api');
const config = require('.././config.js');

let configuration = {
  serviceName: 'Finding',
  opType: 'findItemsByKeywords',
  reqOptions: {
    headers: {
        'X-EBAY-SOA-GLOBAL-ID': 'EBAY-AU'
    }
  },
  params: {
    keywords: "",
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: 0
    },

    itemFilter: [
    ],

    outputSelector: "SellerInfo"
  },
  parser: ebay.parseResponseJson,    // (default)
  devId: config.production.devId,
  certId: config.production.certId,
  appId: config.production.appId,
  authToken: config.production.authToken,
  sandbox: false
}

module.exports = configuration
