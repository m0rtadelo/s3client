const Files = require('../utils/files');

const Config = {
  data: { buckets: [
    { bucket: '', accessKeyId: '', secretAccessKey: '', region: 'eu-west-1', localPath: '/', remotePath: '/' },
  ] },
  loadDataFromFile: () => {
    const stream = Files.read(Config.configFile());
    if (stream) {
      Config.data = JSON.parse((Files.read(Config.configFile()).toString()));
    }
  },
  saveDataToFile: () => {
    Files.write(Config.configFile(), JSON.stringify(Config.data));
  },
  configFile: () => {
    return Files.getAppFolder().concat('config.json');
  },
};

module.exports = Config;
