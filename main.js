const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const { message, handleInit, handleSaveConfigToDisk } = require('./src/actions');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname.concat('/client/assets/icon.png'),
    width: 1000,
    height: 600,
    minWidth: 780,
    minHeight: 500,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      sandbox: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('client/dist/index.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  ipcMain.handle('init', async (event, data) => handleInit());
  ipcMain.handle('saveConfig', async (event, data) => handleSaveConfigToDisk(data));

  ipcMain.on('message', async (event, data) => {
    message(event, data);
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});
