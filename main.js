const {app, BrowserWindow} = require('electron')
const path = require('path')
const { ipcMain } = require('electron')
const VERSION = require('./package.json').version;
const Files = require('./src/utils/files')
const Config = require('./src/services/config')
const fs = require('fs-extra');
const s3 = require('@auth0/s3');

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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    icon: __dirname.concat('/client/assets/icon.png'),
    width: 1000,
    height: 600,
    minWidth: 780,
    minHeight: 500,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      sandbox: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('client/dist/index.html')

}

function handleInit() {
  Config.loadDataFromFile();
  return { ...Config.data, version: VERSION, path: Files.sep() };
}

function handleSaveConfigToDisk(data) {
  Config.data = data
  Config.saveDataToFile();
  return true;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // const handlerMap = {
  //   'init': (cb) => 
  // }
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('init', async (event, data) => handleInit())
  ipcMain.handle('saveConfig', async (event, data) => handleSaveConfigToDisk(data))

  ipcMain.on('message', async (event, data) => {
    const envelope = (upd, event, item, action, process) => {
      upd.on('error', (err) => {
        event.reply('message', { item, action, process, error: err })
      })
      upd.on('end', () => {
        event.reply('message', { item, action, process, end: true })
      })
      upd.on('progress', () => {
        event.reply('message', { item, action, process, progress: { current: upd.progressAmount, total: upd.progressTotal}})
      })
    }
    if (event) {
      const localPath = (key) => data?.bucket?.localPath?.concat(key);
      const remotePath = (key) => data?.bucket?.remotePath?.concat(key);
      const bucket = data?.bucket?.bucket;
      const map = {
        'buckets': () => {
          client.s3.listBuckets(function(err, data) {
            if(err) {
              event.reply('message', { item, action: 'buckets', error: err, process: 'remote' })
            } else {
              event.reply('message', { item, action: 'buckets', data, end: true, process: 'remote' })
            }
          });
        },
        'on': () => { event.reply('message', { data: 'on' })},
        'loadLocal':async  () => {
          try {
            const result = await Files.list(data.bucket.localPath)
            event.reply('message', { action: 'loadLocal', data: result })
          } catch (error) {
            event.reply('message', { action: 'loadLocal', error })
          }
        },
        'deleteItems': () => {
          const client = createClient(data.bucket);
          data.data.local.forEach((item) => {
            if (!item.isDirectory) {
              Files.remove(localPath(item.Key));
              event.reply('message', { item, action: data.action, end: true, process: 'local' })
            } else {
              fs.removeSync(localPath(item.Key), { recursive: true });
              event.reply('message', { item, action: data.action, end: true, process: 'local' })
            }
          })
          data.data.remote.forEach((item) => {
            if(!item.isDirectory) {
              client.s3.deleteObject({ Bucket: bucket, Key: remotePath(item.Key) }, function(err, data) {
                if(err) {
                  event.reply('message', { item, action: 'deleteItems', error: err, process: 'remote' })
                } else {
                  event.reply('message', { item, action: 'deleteItems', data, end: true, process: 'remote' })
                }
              });
            } else {
              const upd = client.deleteDir({
                Bucket: bucket,
                Prefix: remotePath(item.Key),
              })
              envelope(upd, event, item, data.action, 'remote');
            }
          })
        },
        'copyItems': () => {
          const client = createClient(data.bucket);
          data.data.local.forEach((item) => {
            if (!item.isDirectory) {
              const upd = client.uploadFile({ localFile: localPath(item.Key), s3Params: { Bucket: bucket, Key: remotePath(item.Key) }})
              envelope(upd, event, item, data.action, 'upload');
            } else {
              const upd = client.uploadDir({ localDir: localPath(item.Key), s3Params: { Bucket: bucket, Prefix: remotePath(item.Key) }});
              envelope(upd, event, item, data.action, 'upload');
            }
          })
          data.data.remote.forEach((item) => {
            if(!item.isDirectory) {
              const dwn = client.downloadFile({ localFile: localPath(item.Key), s3Params: { Bucket: bucket, Key: remotePath(item.Key) }})
              envelope(dwn, event, item, data.action, 'download');
            } else {
              const upd = client.downloadDir({ localDir: localPath(item.Key), s3Params: { Bucket: bucket, Prefix: remotePath(item.Key) }});
              envelope(upd, event, item, data.action, 'download');
            }
          })
        },
        'check': () => {
          const client = createClient(data.data)
          client.s3.getBucketLogging({ Bucket: data.data.bucket }, function(err, data) {
            if(err) {
              event.reply('message', { action: 'check', error: err })
            } else {
              event.reply('message', { action: 'check', data, end: true })
            }
          })
        },
        'loadRemote': () => {
          {
            const client = createClient(data.bucket)
            const list = client.listObjects( { s3Params: { Bucket: bucket }})
            list.on('data', (data) => {
              event.reply('message', { action: 'loadRemote', data })
            })
            list.on('error', (err) => {
              event.reply('message', { action: 'loadRemote', error: err })
            })
            list.on('end', () => {
              event.reply('message', { action: 'loadRemote', end: true })
            })
          }          
        }
      }
      map[data.action || data]?.();
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})