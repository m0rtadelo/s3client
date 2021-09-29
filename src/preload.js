const { ipcRenderer } = require('electron');
const { contextBridge } = require('electron');

let holder;
ipcRenderer.on('message', (event, arg) => {
  if (event && arg && holder) {
    holder(arg);
  }
});
contextBridge.exposeInMainWorld('api', {
  electron: true,
  loadLocal: async (data) => await ipcRenderer.invoke('loadLocal', data),
  check: async (data) => await ipcRenderer.invoke('check', data),
  saveConfig: async (data) => await ipcRenderer.invoke('saveConfig', data),
  init: async () => await ipcRenderer.invoke('init'),
  message: function(func) {
    holder = func;
    if (func) {
      ipcRenderer.send('message', 'on');
    }
  },
  sendMessage: (data) => {
    ipcRenderer.send('message', data);
  },
});

