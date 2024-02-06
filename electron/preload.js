// Electron preload script

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    // ipcRenderer.send is one way, .invoke is asynchronous query
    test: () => ipcRenderer.invoke('test'),
    checkResource: () => ipcRenderer.invoke('check-resource')
})