const fs = require('fs-extra');
const Files = require('../utils/files');

module.exports.deleteItems = (event, data, localPath, remotePath, bucket) => {
  const client = require('./index').createClient(data.bucket);
  data.data.local.forEach((item) => {
    if (!item.isDirectory) {
      Files.remove(localPath(item.Key));
      event.reply('message', { item, action: data.action, end: true, process: 'local' });
    } else {
      fs.removeSync(localPath(item.Key), { recursive: true });
      event.reply('message', { item, action: data.action, end: true, process: 'local' });
    }
  });
  data.data.remote.forEach((item) => {
    if (!item.isDirectory) {
      client.s3.deleteObject({ Bucket: bucket, Key: remotePath(item.Key) }, function(err, data) {
        if (err) {
          event.reply('message', { item, action: 'deleteItems', error: err, process: 'remote' });
        } else {
          event.reply('message', { item, action: 'deleteItems', data, end: true, process: 'remote' });
        }
      });
    } else {
      const upd = client.deleteDir({
        Bucket: bucket,
        Prefix: remotePath(item.Key),
      });
      require('./index').envelope(upd, event, item, data.action, 'remote');
    }
  });
};
