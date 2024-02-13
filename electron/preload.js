// Electron preload script

const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    // ipcRenderer.send is one way, .invoke is asynchronous query
    test: () => ipcRenderer.invoke('test'),
    checkResource: () => ipcRenderer.invoke('check-resource'),
    closeApp: () => ipcRenderer.invoke('close-app'),
    relaunchApp: () => ipcRenderer.invoke('relaunch-app'),
    inputDialog: () => ipcRenderer.invoke('input-dialog'),
    outputDialog: () => ipcRenderer.invoke('output-dialog'),
    process: (config) => ipcRenderer.invoke('process', config),
    checkProgress: (config) => ipcRenderer.invoke('check-progress', config),
    openFolder: (pathToFile) => ipcRenderer.invoke('open-folder', pathToFile)
})