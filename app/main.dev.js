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
import sendToElastic from './utils/external-logging';

process.on('uncaughtException', (err) => {
  try {
    sendToElastic({
      message: err.message,
      stack: err.stack
    });
  } catch (e) {
    sendToElastic({
      message: e.message,
      stack: e.stack
    });
  }
});

process.on('unhandledRejection', (err) => {
  try {
    sendToElastic({
      message: err.message,
      stack: err.stack
    });
  } catch (e) {
    sendToElastic({
      message: e.message,
      stack: e.stack
    });
  }
});

import { app, BrowserWindow, clipboard, shell } from 'electron'; //eslint-disable-line

const { trackEvent, screenView } = require('./utils/google-analytics');

let mainWindow = null;
let loadingWindow = null;

const defaultWindowConfig = {
  darkTheme: true,
  center: true,
  show: false,
  width: 1024,
  height: 768,
  backgroundColor: '#10161a'
};

if (process.env.NODE_ENV === 'production') {
  trackEvent('Application Interaction', 'Application Started');

  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

/**
 * Globals
 */
global.trackEvent = trackEvent;
global.screenView = screenView;

global.reload = () => {
  loadingWindow = null;
  buildLoadingWindow();

  mainWindow.close();
  mainWindow = null;

  buildMainWindow();
};

global.openUrl = (url) => {
  shell.openExternal(url);
};

global.copyToClipboard = (data) => {
  clipboard.writeText(data);
};

global.exit = () => {
  process.exit(0);
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

/**
 * DevTools
 */
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
 * Windows
 */
const buildLoadingWindow = () => {
  loadingWindow = new BrowserWindow(defaultWindowConfig);

  loadingWindow.loadURL(`file://${__dirname}/loading.html`);

  loadingWindow.on('closed', () => {
    loadingWindow = null;
  });

  loadingWindow.webContents.on('did-finish-load', () => {
    loadingWindow.show();
    loadingWindow.maximize();
    loadingWindow.focus();
    loadingWindow.setMenuBarVisibility(false);
  });
};

const buildMainWindow = () => {
  mainWindow = new BrowserWindow(defaultWindowConfig);

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      if (loadingWindow) {
        loadingWindow.close();
      }

      mainWindow.maximize();
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setMenuBarVisibility(false);
    }, 1000);
  });

  mainWindow.on('closed', () => {
    // TODO: This step fire BUG when reload is fired, check before.
    // mainWindow = null;
  });
};

/**
 * Start
 */
app.on('ready', async () => {
  await installExtensions();

  buildLoadingWindow();
  buildMainWindow();
});
