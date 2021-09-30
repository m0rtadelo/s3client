const packager = require('electron-packager');
const { rebuild } = require('electron-rebuild');
const { zip } = require('zip-a-folder');
const { version } = require('./package.json');
const fs = require('fs-extra');
const rra = require('recursive-readdir-async');

const doRebuild = true;

const options = {
  'all': false,
  'platform': process.platform,
  'arch': 'all',
  'dir': './',
  'app-copyright': 'Ricard Fíguls',
  'app-version': version,
  'icon': './client/dist/assets/icon.png',
  'name': 's3client',
  'ignore': ['client/assets', 'client/node_modules', 'client/src', 'node_modules/electron-installer-debian',
    '.packages/', './.git', '/.nyc_output', '/coverage', '.auth.json',
    '.build.js', '/tests', '.myteam', '.pdf', '.docx'],
  'out': './packages',
  'overwrite': true,
  'prune': true,
  'version': version,
  'version-string': {
    CompanyName: 'RFM Software',
    FileDescription: 's3client',
    OriginalFilename: 's3client',
    ProductName: 's3client',
    InternalName: 's3client',
  },
  'afterCopy': [(buildPath, electronVersion, platform, arch, cb) => {
    if (platform === process.platform && doRebuild) {
      console.log('rebuild ' + buildPath + ' (' + arch + ')');
      fs.copySync(
          './node_modules/aws-sdk/clients/codebuild.js', buildPath + '/node_modules/aws-sdk/clients/codebuild.js',
      );
      rebuild({ path: buildPath, buildPath, electronVersion, arch })
          .then(() => cb())
          .catch((err) => {
            console.error(`Oooops ${platform}.${arch} rebuild ERROR!`); cb();
          });
    } else {
      cb();
    }
  }],
};

async function build() {
  console.log('Removing ' + options.out + ' folder...');
  fs.removeSync(options.out, { recursive: true });
  console.log('Building version ' + version + ' for ' + process.platform + '...');
  const paths = await packager(options);
  console.log('Fixing build and zipping packages...');
  paths.forEach(async (p) => {
    fs.removeSync('./' + p + '/resources/app/client/assets', { resursive: true } );
    fs.removeSync('./' + p + '/resources/app/client/node_modules', { resursive: true } );
    fs.removeSync('./' + p + '/resources/app/client/src', { resursive: true } );
    const files = await rra.list('./' + p + '/resources/app/client/', { recursive: false, stats: true });
    if (files && files.length) {
      files.forEach((file) => {
        if (!file.isDirectory) {
          fs.unlinkSync(file.fullname);
        }
      });
    }
    const name = p.split(' /').pop();
    await zip('./' + p, './' + name + '.zip');
    console.log(p + '.zip file created!');
  });
  if (require('os').platform().includes('linux')) {
    console.log('Creating debian deb package...');
    try {
      const installer = require('electron-installer-debian');
      installer({
        src: 'packages/s3client-linux-x64/',
        dest: 'packages/',
        arch: 'amd64',
        options: {
          icon: 'client/dist/assets/icon.png',
        },
      }).then((result) => {
        const orDeb = result.packagePaths;
        // const fiDeb = 'packages/s3client-linux-x64-v' + version + '.deb'
        const fiDeb = 'packages/s3client-linux-x64.deb';
        require('fs').renameSync(orDeb.toString(), fiDeb.toString());
        console.log(fiDeb + ' file created!');
      })
          .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  }
  if (require('os').platform().includes('win32')) {
    console.log('Creating Windows installer...');
    const installer = require('electron-installer-windows');
    try {
      await installer({
        src: 'packages/s3client-win32-x64/',
        dest: 'packages/',
      });
      console.log('packages/s3client-' + version + '-setup.exe' + ' file created!');
    } catch (e) {
      console.log(`No dice: ${e.message}`);
    }
  }
}

build().then(() => { }).catch((err) => {
  console.error(err);
});
