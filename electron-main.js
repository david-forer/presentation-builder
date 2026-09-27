const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

// In a packaged app, files live in resources/app (or resources/).
// In dev, they're in the project root (__dirname).
const isPackaged = app.isPackaged;
const appRoot = isPackaged
  ? path.join(process.resourcesPath, 'app')
  : __dirname;

// Load .env manually so the API key is available to the child server process
const envPath = path.join(appRoot, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

const PORT = process.env.PORT || 3000;
let server;
let mainWindow;

// Spawn the Express server as a child process
function startServer() {
  server = spawn('node', [path.join(appRoot, 'server.js')], {
    env: { ...process.env, PORT },
    cwd: appRoot,
    stdio: 'ignore'
  });

  server.on('error', (err) => {
    console.error('Server failed to start:', err);
  });
}

// Poll until the server is ready, then open the window
function waitForServer(callback, attempts = 0) {
  if (attempts > 50) {
    console.error('Server did not start in time');
    return;
  }
  http.get(`http://localhost:${PORT}`, (res) => {
    callback();
  }).on('error', () => {
    setTimeout(() => waitForServer(callback, attempts + 1), 200);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Presentation Builder',
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startServer();
  waitForServer(() => createWindow());
});

// Quit when all windows closed (Windows/Linux)
app.on('window-all-closed', () => {
  if (server) server.kill();
  if (process.platform !== 'darwin') app.quit();
});

// macOS: re-create window if activated with no windows open
app.on('activate', () => {
  if (!mainWindow) {
    waitForServer(() => createWindow());
  }
});

// Kill server when app is quitting
app.on('will-quit', () => {
  if (server) server.kill();
});
