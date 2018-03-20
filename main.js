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


//Load the window
let mainWindow = null;
app.on('window-all-closed', () => app.quit());


function createWindow () {
  mainWindow = new BrowserWindow({width: 1155, height: 705})

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
