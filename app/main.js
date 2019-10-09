const fs = require("fs");
// es6 destructuring syntax
// pull off certain properties of an obj

// can pull in menu and its many menu items
const { app, BrowserWindow, dialog, Menu } = require("electron");

// dialog is native per file system

// tray works for windows and mac
// electron.TouchBar works for mac

// dialog is native system dialogs
// in app purchases
// all on the electron object

// diff modules for main process and renderer process
// only one main process
// most of the core functionality is available to main process
// renderer process can always communicate with main

// when you need lifecycle events
// event listeners for mouseover events

// BrowserWindow has capital
// if capital, then use as a constructor
// using new syntax in js

// keep from getting garbage collected
// will be alive until app quits
// higher level scope
let mainWindow = null;

// basic lifecycle
app.on("ready", () => {
  // runs after eval file
  // 2
  // console.log("The application is ready");

  // sucks if we see white screen first
  // now we want to load index then show browser
  // load html in, then show
  mainWindow = new BrowserWindow({ show: false });
  // after this function happens, this window is open for garbage
  // collection

  // macos has special case for first menu item
  // node can tell what platform we're on


  // wait until ready`
  Menu.setApplicationMenu(applicationMenu);

  // __dirname resolves to current file system place
  // node convention
  mainWindow.loadFile(`${__dirname}/index.html`);

  // eventually will want to wire this up to the button
  // getFileFromUser();

  // event emitter node
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
});

// main process totally separate from render process
// need to facilitate communication between two processes
// remote module
// only available in renderer process

// go read that main process for me

// remote.require

// 1
console.log("starting up...");

// initial code will live here

// want to use native system dialogs
// so it's per builtin system

// take export so that remote can communicate
// this is a node thing
// put a method on the property of getfile
exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog({
    // picking files?
    // could be several files

    // want to filter what the user can actually select
    // aka no dank mememes

    properties: ["openFile"],
    buttonLabel: "Unveil",
    //on mac won't see this title
    title: "Open Fire Sale Document",
    filters: [
      // name files goes into options
      // preference of showing in file system
      // super cool can name this whatever like dope texts
      { name: "Markdown Files", extensions: ["md", "mdown", "markdown"] },
      { name: "Text Files", extensions: ["txt", "text"] }
    ]
  });

  // if no such thing as files or undefined
  // defensive against clicking cancel
  if (!files) return;

  // get first file out of the array
  const [file] = files;

  openFile(file);

  // show result of files
  // console.log(files);

  // console.log(content);

  // start with read the file and show
};

// any time you change the main process
// you have to start

// tell my other function which file
// then handle everything else
// want to have these things happen on the main
// not blcoking on rendering

const openFile = file => {
  // this will block main process
  const content = fs.readFileSync(file).toString();

  // arbitrary string giving the message of what kind of message
  // anything after is sending attachments other params

  // since main is for more os
  // recent files is very os
  // that's like recent files on click of app
  // playing nicely with native even though
  // this is built on web technology

  // you're never going to completely fool someone
  // with native

  // better to do some of the base level in app in electron
  // shouldn't try to fool user into thinking that it's native
  app.addRecentDocument(file);

  // ipc main
  // ipc render
  // ipc = interprocess communication
  mainWindow.webContents.send("file-opened", file, content);
};

// basic js data structure to build for it 
// can create context menus 
// any type of menu via this menu constructor
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        click() {
          console.log('Open File');
        }
      }
    ]
  }
];

// darwin === macos
if (process.platform === 'darwin') {
  // when we build the electron app 
  // we'll need to rename here
  const applicationName = 'Fire Sale';

  // unshift adds to the beginning 
  template.unshift({
    label: applicationName,
    submenu: [
      {
        label: `About ${applicationName}`,
      },
      {
        label: `Quit ${applicationName}`
      }
    ]
  });
}

// if you dismiss default application menu
// then you lose copy and paste 


const applicationMenu = Menu.buildFromTemplate(template);
