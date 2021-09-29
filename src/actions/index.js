const s3 = require('@auth0/s3');
const Config = require('../services/config')
const Files = require('../utils/files')
const VERSION = require('../../package.json').version;

const createClient = (params) => (s3.createClient({
  maxAsyncS3: Config.data?.s3client?.maxAsyncS3 || 20,     // this is the default
  s3RetryCount: Config.data?.s3client?.s3RetryCount || 3,    // this is the default
  s3RetryDelay: Config.data?.s3client?.s3RetryDelay || 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: params.accessKeyId,
    secretAccessKey: params.secretAccessKey,
    region: params.region,
    // endpoint: 's3.yourdomain.com',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  },
}))
module.exports.createClient = createClient;
module.exports.handleInit = () => {
  Config.loadDataFromFile();
  return { ...Config.data, version: VERSION, path: Files.sep() };
}

module.exports.handleSaveConfigToDisk = (data) => {
  Config.data = data
  Config.saveDataToFile();
  return true;
}

module.exports.envelope = (upd, event, item, action, process) => {
  upd.on('error', (err) => {
    event.reply('message', { item, action, process, error: err })
  })
  upd.on('end', () => {
    event.reply('message', { item, action, process, end: true })
  })
  upd.on('progress', () => {
    event.reply('message', { item, action, process, progress: { current: upd.progressAmount, total: upd.progressTotal } })
  })
};

module.exports.message = (event, data) => {
  if (event) {
    const localPath = (key) => data?.bucket?.localPath?.concat(key);
    const remotePath = (key) => data?.bucket?.remotePath?.concat(key);
    const bucket = data?.bucket?.bucket;
    const map = {
      'on': () => { event.reply('message', { data: 'on' }) },
      'buckets': () => require('./buckets').buckets(event, client),
      'loadLocal': async () => await require('./loadLocal').loadLocal(event, data),
      'deleteItems': () => require('./deleteItems').deleteItems(event, data, localPath, remotePath, bucket),
      'copyItems': () => require('./copyItems').copyItems(event, data, localPath, remotePath, bucket),
      'check': () => require('./check').check(event, data),
      'loadRemote': () => require('./loadRemote').loadRemote(event, data, bucket),
    }
    map[data.action || data]?.();
  }
}