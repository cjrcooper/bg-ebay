'use strict';

const electron = require('electron')
const { app, BrowserWindow } = require('electron');

const fs = require('fs');
const path = require('path')
const url = require('url')
const handlebars = require('handlebars'); 


//Read files from the HTML
var main = fs.readFileSync('./hbs/main.html').toString();
var template = fs.readFileSync('./hbs/template.html').toString();
var body = fs.readFileSync('./hbs/index.html');
var sideNavigation = fs.readFileSync('./hbs/partials/sideNavigation.html');

//Create the template
// var data = {
//   body,
//   sideNavigation,
//   title: "test"
// };
// 
// var updateMain = (result) => {
//   fs.writeFile(__dirname + '/hbs/main.html', result, function(err) {
//       if(err) {
//           return console.log(err);
//       }
//     console.log("written to file");
//     console.log(fs.readFileSync('./hbs/main.html').toString());
//   });
// } 
// 
// var result = ((data) => {
//   for (var property in data) {
//     if(property){
//       let newTemplate = handlebars.compile(template);
//       let newRes = newTemplate(data);
//       updateMain(newRes);
//     }
//   }
//   let newTemplate = handlebars.compile(main);
//   let newRes = newTemplate(data);
//   updateMain(newRes);
// })(data);


//Load the window
let mainWindow = null;
app.on('window-all-closed', () => app.quit());


function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/hbs/main.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
