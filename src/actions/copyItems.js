

module.exports.copyItems = (event, data, localPath, remotePath, bucket) => {
  const client = require('./index').createClient(data.bucket);
  data.data.local.forEach((item) => {
    if (!item.isDirectory) {
      const upd = client.uploadFile(
          { localFile: localPath(item.Key), s3Params: { Bucket: bucket, Key: remotePath(item.Key) } },
      );
      require('./index').envelope(upd, event, item, data.action, 'upload');
    } else {
      const upd = client.uploadDir(
          { localDir: localPath(item.Key), s3Params: { Bucket: bucket, Prefix: remotePath(item.Key) } },
      );
      require('./index').envelope(upd, event, item, data.action, 'upload');
    }
  });
  data.data.remote.forEach((item) => {
    if (!item.isDirectory) {
      const dwn = client.downloadFile(
          { localFile: localPath(item.Key), s3Params: { Bucket: bucket, Key: remotePath(item.Key) } },
      );
      require('./index').envelope(dwn, event, item, data.action, 'download');
    } else {
      const upd = client.downloadDir(
          { localDir: localPath(item.Key), s3Params: { Bucket: bucket, Prefix: remotePath(item.Key) } },
      );
      require('./index').envelope(upd, event, item, data.action, 'download');
    }
  });
};
