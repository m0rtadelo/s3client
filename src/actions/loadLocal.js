const Files = require('../utils/files');

module.exports.loadLocal = async (event, data) => {
  try {
    const result = await Files.list(data.bucket.localPath);
    event.reply('message', { action: 'loadLocal', data: result });
  } catch (error) {
    event.reply('message', { action: 'loadLocal', error });
  }
};
