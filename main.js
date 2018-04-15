'use strict';

const electron = require('electron')
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');

const fs = require('fs');
const path = require('path')
const url = require('url')
const handlebars = require('handlebars');


//Setup logger
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

//Setup updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Updated available');
  console.log('Version', info.version);
  console.log('Release date', info.releaseDate);
});


autoUpdater.on('update-not-available', () => {
  console.log('Updated not available');
});

autoUpdater.on('download-progress', (progress) => {
  console.log(`Process ${Math.floor(progress.percent)}`)
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update download');
  autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (error) => {
  console.log(error);
})

electron.app.onm


//Load the window
let mainWindow = null;
app.on('window-all-closed', () => app.quit());


function createWindow () {

  if (!isDev) {
    autoUpdater.checkForUpdates();
  }

  mainWindow = new BrowserWindow({width: 1155, height: 705})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/html/main.html'),
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
