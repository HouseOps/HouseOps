const os = require('os');
const Package = require('../package');

const elasticsearch = require('elasticsearch');
const uuidv4 = require('uuid/v4');

const client = new elasticsearch.Client({
  host: '34.199.103.143:9200',
  log: 'trace'
});

export default (body) => {
  client.create({
    index: 'houseops',
    type: 'user-electron',
    id: uuidv4(),
    meta: {
      published_at: Date.now(),
      version: Package.version,
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type()
      }
    },
    body
  });
};
