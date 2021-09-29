module.exports.check = (event, data) => {
  const client = require('./index').createClient(data.data)
  client.s3.getBucketLogging({ Bucket: data.data.bucket }, function (error, data) {
    if (error) {
      event.reply('message', { action: 'check', error })
    } else {
      event.reply('message', { action: 'check', data, end: true })
    }
  })
}