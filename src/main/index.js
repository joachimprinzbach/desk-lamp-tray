'use strict'

import {app, BrowserWindow, globalShortcut, ipcMain, Tray} from 'electron'
import {Lookup} from 'node-yeelight-wifi'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let tray
let _light
let on = false
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// nativeTheme.on('updated', function theThemeHasChanged () {
  // updateMyAppTheme(nativeTheme.shouldUseDarkColors)
// })

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })
}

const createTray = () => {
  tray = new Tray(path.join(__static, 'dark_mode.png'))
  tray.on('click', function (event) {
    toggleWindow()
  })
}

const toggleWindow = () => {
  mainWindow.isVisible() ? mainWindow.hide() : showWindow()
}

const showWindow = () => {
  const position = getWindowPosition()
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
}

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}

ipcMain.on('show-window', () => {
  showWindow()
})

app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
  lookupLights()
  globalShortcut.register('CommandOrControl+o', () => {
    toggleLight()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const lookupLights = () => {
  let look = new Lookup()

  look.on('detected', (light) => {
    if (light.model === 'lamp2') {
      _light = light
      this._light.on('stateUpdate', (updatedLightInfo) => {
        on = updatedLightInfo.power
      })
    } else {
      console.warn('Unsupported model detected: ' + light.model)
    }
  })
}

const toggleLight = () => {
  if (on === false) {
    _light.setPower('on')
    on = true
  } else {
    _light.setPower('off')
    on = false
  }
}
