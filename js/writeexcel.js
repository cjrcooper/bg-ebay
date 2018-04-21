const xl = require('excel4node');
const logging = require('./logging.js');
const filepaths = require('./filepaths.js')



let excel = {
  createExcel: (data) => {
    
    try {
      if (data.length < 1) {
        return
      }
    
      let wb = new xl.Workbook();
      let ws = wb.addWorksheet("EbayListings");
      let iterate = 2;
      let myStyle = wb.createStyle({
        font: {
          bold: true,
          color: '#FF0800'
        }
      });
      let logpath = filepaths.logPath();
      
        _.forEach(excelDataResults, (value) => {
      
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
        });
            
        wb.writeToBuffer().then((buffer) => {
            fs.writeFileSync(logpath, buffer);
          };
        }
    } catch (e) {
        logging.error(e);
    }
  }
}


module.exports = excel