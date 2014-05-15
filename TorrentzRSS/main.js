var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var fs = require('fs');
var shell = require('shell');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var serverWindow = null;
var storage = {};

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
      if (typeof storage['background'] !== false && storage['background']) {
          fs.writeFileSync('./temp', "running in background2");
      } else {
          fs.writeFileSync('./temp', "Quitting2");
          app.quit();
      }
  }

});

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1200, height: 800});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  serverWindow = new BrowserWindow({width: 400, height: 300, show: false});
  serverWindow.loadUrl('file://' + __dirname + '/server.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    //mainWindow.hide();
  });
    mainWindow.on('close', function(event) {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        //mainWindow = null;

        if (typeof storage['background'] !== false && storage['background']) {
            event.preventDefault();
            fs.writeFileSync('./temp2', "runni3ng in background");
            mainWindow.minimize();
        } else {
            serverWindow.close();
            fs.writeFileSync('./temp2', "Quitting");

        }
    });

});



if (fs.existsSync('./storage')) {
    storage = JSON.parse(fs.readFileSync('./storage'));
}

var ipc = require('ipc');
ipc.on('set', function(event, arg) {
    storage[arg] = true;
    fs.writeFileSync('./storage', JSON.stringify(storage));
});
ipc.on('unset', function(event, arg) {
    storage[arg] = false;
    fs.writeFileSync('./storage', JSON.stringify(storage));
});

ipc.on('storage', function(event, key, value) {
    if (typeof value !== "undefined") {
        storage[key] = value;
        fs.writeFileSync('./storage', JSON.stringify(storage));
        event.returnValue = true;
    } else {
        if (typeof storage[key] !== "undefined") {
            event.returnValue = storage[key];
        } else {
            event.returnValue = null;
        }
    }

    shell.beep();
});

/*
var Menu = require('menu');
var MenuItem = require('menu-item');

var menu = new Menu();

var template = [
  {
    label: 'Atom Shell',
    submenu: [
      {
        label: 'About Atom Shell',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Atom Shell',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
      },
    ]
  },
  {
    label: 'Window',
    submenu: [
      {
        label: 'Minimize',
        accelerator: 'Command+M',
        selector: 'performMiniaturize:'
      },
      {
        label: 'Close',
        accelerator: 'Command+W',
        selector: 'performClose:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        selector: 'arrangeInFront:'
      },
    ]
  },
];

menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
*/
