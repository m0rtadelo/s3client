
module.exports.buckets = (event, client) => {
  client.s3.listBuckets(function (err, data) {
    if (err) {
      event.reply('message', {  action: 'buckets', error: err, process: 'remote' })
    } else {
      event.reply('message', {  action: 'buckets', data, end: true, process: 'remote' })
    }
  });
}