/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow } from 'electron';
// import MenuBuilder from './menu';

const { trackEvent, screenView } = require('./utils/google-analytics');

global.trackEvent = trackEvent;
global.screenView = screenView;

global.reload = () => {
  mainWindow = null;
  loadingScreen = null;

  buildLoadingScreen();
  buildMainScreen();
};

global.exit = () => {
  process.exit(0);
};

let mainWindow = null;
let loadingScreen = null;

if (process.env.NODE_ENV === 'production') {
  trackEvent('Application Interaction', 'Application Started');

  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


const buildLoadingScreen = () => {
  loadingScreen = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  loadingScreen.loadURL(`file://${__dirname}/loading.html`);

  loadingScreen.on('closed', () => {
    loadingScreen = null;
  });

  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
    loadingScreen.maximize();
    loadingScreen.focus();
    loadingScreen.setMenuBarVisibility(false);
  });

};

const buildMainScreen = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.close();
      }

      mainWindow.maximize();
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setMenuBarVisibility(false);
    }, 3000);

  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  /* const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu(); */
};

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  buildLoadingScreen();
  buildMainScreen();
});
