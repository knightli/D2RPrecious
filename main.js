// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const { ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    fullscreenable: false,
    transparent: true,
    skipTaskbar: true,
    center: true,
    webPreferences: {
      nodeIntegration: true, // Electron 10 deprecate nodeIntegration flag (removed in Electron 12)
      contextIsolation: false, // protect against prototype pollution
      // enableRemoteModule: false, // turn off remote
      // nodeIntegrationInWorker: false,
      // nodeIntegrationInSubFrames: false,
      // sandbox: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Add Menu to Open the DevTools.
  if (true || process.env.NODE_ENV === 'development') {
    mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            if (mainWindow.webContents.isDevToolsOpened()) {
              mainWindow.webContents.closeDevTools();
            } else {
              mainWindow.inspectElement(x, y);
            }
          },
        },
        {
          label: 'Refresh',
          click() {
            mainWindow.webContents.reloadIgnoringCache();
          },
        },
      ]).popup(mainWindow);
    });
  }

  ipcMain.on('close-win', () => {
    if (mainWindow) {
      mainWindow.destroy()
    }
  })

  mainWindow.on('always-on-top-changed', (e, isAlwaysOnTop) => {
    mainWindow.webContents.send('always-on-top-changed', isAlwaysOnTop)
  })

  ipcMain.on('is-top', () => {
    if (mainWindow) {
      let isTop = mainWindow.isAlwaysOnTop()
      mainWindow.webContents.send('is-top', isTop)
    }
  })

  ipcMain.on('enable-top', () => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(true)
    }
  })

  ipcMain.on('disable-top', () => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(false)
    }
  })



}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
