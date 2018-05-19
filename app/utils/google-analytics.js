import { app } from 'electron';

const Package = require('../package');

const ua = require('universal-analytics');
const uuid = require('uuid/v4');
const { JSONStorage } = require('node-localstorage');

const nodeStorage = new JSONStorage(app.getPath('userData'));

// Retrieve the userid value, and if it's not there, assign it a new uuid.
const userId = nodeStorage.getItem('userid') || uuid();

// (re)save the userid, so it persists for the next app session.
nodeStorage.setItem('userid', userId);

const usr = ua('UA-119549159-1', userId);

function trackEvent(category, action, label, value) {
  usr
    .event({
      ec: category,
      ea: action,
      el: label,
      ev: value,
    })
    .send();
}

function screenView(screenName) {
  usr
    .screenview(screenName, 'HouseOps', Package.version)
    .send();
}

module.exports = { trackEvent, screenView };
