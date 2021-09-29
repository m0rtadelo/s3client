module.exports.loadRemote = (event, data, bucket) => {
  const client = require('./index').createClient(data.bucket);
  const list = client.listObjects({ s3Params: { Bucket: bucket } });
  list.on('data', (data) => {
    event.reply('message', { action: 'loadRemote', data });
  });
  list.on('error', (error) => {
    event.reply('message', { action: 'loadRemote', error: err });
  });
  list.on('end', () => {
    event.reply('message', { action: 'loadRemote', end: true });
  });
};
