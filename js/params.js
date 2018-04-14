var config = require('.././config.js');

let configuration = {
  serviceName: 'Finding',
  opType: 'findItemsByKeywords',
  reqOptions: {
    headers: {
        'X-EBAY-SOA-GLOBAL-ID': 'EBAY-AU'
    }
  },
  params: {  keywords: setKeyWords(),
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: setPageEntries()
    },

    itemFilter: [
      {name: 'FreeShippingOnly', value: freeShippingOnly()},
      {name: 'MaxPrice', value: setMaxPrice()}
    ],

    outputSelector: "SellerInfo"
  },
  parser: {},    // (default)
  devId: config.production.devId,
  certId: config.production.certId,
  appId: config.production.appId,
  authToken: config.production.authToken,
  sandbox: false
}

module.exports = configuration
