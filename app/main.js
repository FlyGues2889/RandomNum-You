const { app, BrowserWindow, nativeTheme } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 680,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#f5f3f700',
      height: 48,
      symbolColor: '#828282'
    },
    minHeight: 680,
    minWidth: 800,
    icon: path.join(__dirname, 'assets/appIcon.ico')
  })

  win.loadFile('index.html')

  // 监听系统主题的变化
  nativeTheme.on('updated', () => {
    const theme = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    win.webContents.send('system-theme-changed', theme)
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
