const fs = require('fs');
const path = require('path');
const rra = require('recursive-readdir-async');

const Files = {
  list: (path) => {
    return rra.list(path, { recursive: false, ignoreFolders: false, stats: true });
  },
  sep: () => path.sep,
  remove: (filename) => {
    try {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
      }
    } catch (error) {
      console.error(`Unable to remove file ${filename} (error ${error})`);
    }
  },
  write: (filename, data) => {
    try {
      fs.writeFileSync(filename, data);
    } catch (error) {
      console.error(`Unable to write file ${filename} (error ${error})`);
    }
  },
  read: (filename) => {
    try {
      return fs.readFileSync(filename);
    } catch (error) {
      console.error(`Unable to read file ${filename} (error ${error})`);
    }
  },
  mk: (dirname) => {
    try {
      return fs.mkdirSync(dirname);
    } catch (error) {
      console.error(`Unable to create folder ${dirname} (error ${error})`);
    }
  },
  exist: (filename) => fs.existsSync(filename),
  getAppFolder: () => {
    try {
      return require('electron').app.getPath('appData').concat(path.sep).concat('s3client').concat(path.sep);
    } catch (error) {
      return `${__dirname}/`;
    }
  },
  copy: (fileori, filedes) => fs.copyFileSync(fileori, filedes),
};

module.exports = Files;
