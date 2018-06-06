const os = require('os');
const moment = require('moment');
const Package = require('../package');

const elasticsearch = require('elasticsearch');
const uuidv4 = require('uuid/v4');

const client = new elasticsearch.Client({
  host: '34.199.103.143:9200',
  log: 'trace'
});

export default (body) => {
  body.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ'); // eslint-disable-line
  body.meta = { // eslint-disable-line
    version: Package.version,
    os: {
      platform: os.platform(),
      release: os.release(),
      type: os.type()
    }
  };

  try {
    client.create({
      index: 'houseops-prd',
      type: 'electron',
      id: uuidv4(),
      body
    });
  } catch (err) {
    console.error(err);
  }
};
