// Simple packaging script: copies Electron binaries + app files into dist/win-unpacked
// Output: dist/win-unpacked/presentation-builder.exe (just run it, no install needed)

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist', 'win-unpacked');
const ELECTRON_DIST = path.join(ROOT, 'node_modules', 'electron', 'dist');
const APP_DIR = path.join(OUT, 'resources', 'app');

function copyDir(src, dest, exclude = []) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Clean output
console.log('Cleaning dist/win-unpacked...');
fs.rmSync(OUT, { recursive: true, force: true });

// 2. Copy Electron binaries
console.log('Copying Electron binaries...');
copyDir(ELECTRON_DIST, OUT);

// 3. Rename electron.exe -> presentation-builder.exe
const exeSrc = path.join(OUT, 'electron.exe');
const exeDest = path.join(OUT, 'presentation-builder.exe');
if (fs.existsSync(exeSrc)) {
  fs.renameSync(exeSrc, exeDest);
}

// 4. Copy app files into resources/app
console.log('Copying app files...');
fs.mkdirSync(APP_DIR, { recursive: true });

// Copy specific files
['electron-main.js', 'server.js', 'presets.js', 'package.json', '.env'].forEach((file) => {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(APP_DIR, file));
  } else {
    console.warn(`Warning: ${file} not found, skipping`);
  }
});

// Copy directories
copyDir(path.join(ROOT, 'public'), path.join(APP_DIR, 'public'));
if (fs.existsSync(path.join(ROOT, 'output'))) {
  copyDir(path.join(ROOT, 'output'), path.join(APP_DIR, 'output'));
}
copyDir(path.join(ROOT, 'templates'), path.join(APP_DIR, 'templates'));
copyDir(path.join(ROOT, 'node_modules'), path.join(APP_DIR, 'node_modules'), [
  'electron',          // not needed at runtime
  'electron-builder',  // dev only
  '.package-lock.json'
]);

// 5. Create desktop shortcut via PowerShell (.ps1 file avoids quoting issues)
if (process.platform === 'win32') {
  const { execSync } = require('child_process');
  const os = require('os');
  // Check OneDrive Desktop first, then regular Desktop
  const oneDriveDesktop = path.join(process.env.USERPROFILE, 'OneDrive', 'Desktop');
  const regularDesktop = path.join(process.env.USERPROFILE, 'Desktop');
  const desktop = fs.existsSync(oneDriveDesktop) ? oneDriveDesktop : regularDesktop;
  const lnkPath = path.join(desktop, 'Presentation Builder.lnk');
  const workDir = path.dirname(exeDest);
  const psScript = path.join(os.tmpdir(), 'create-shortcut.ps1');
  fs.writeFileSync(psScript, [
    '$s = New-Object -ComObject WScript.Shell',
    '$lnk = $s.CreateShortcut("' + lnkPath + '")',
    '$lnk.TargetPath = "' + exeDest + '"',
    '$lnk.WorkingDirectory = "' + workDir + '"',
    '$lnk.Save()'
  ].join('\n'));
  try {
    execSync('powershell -NoProfile -ExecutionPolicy Bypass -File "' + psScript + '"', { stdio: 'ignore' });
    console.log('Desktop shortcut created: ' + lnkPath);
  } catch (e) {
    console.warn('Could not create shortcut automatically.');
    console.warn('  ' + exeDest);
  }
  fs.unlinkSync(psScript);
}

console.log('');
console.log('Done. Your app is at:');
console.log('  ' + exeDest);
