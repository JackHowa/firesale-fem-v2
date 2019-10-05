const marked = require("marked");
const path = require("path");

// use ipc renderer in renderer, main in main
const { remote, ipcRenderer } = require("electron");
// using require in the browser....
// doesn't work
// in electron, we have access to browser and node apis

// two defaults for file, content
let filePath = null;
let originalContent = "";
let isEdited = false;

// need to require in the context of the main context
// all of this code renders in the main process
const mainProcess = remote.require("./main");

// get window for current reference shown
// get me a reference to which window
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector("#markdown");
const htmlView = document.querySelector("#html");
const newFileButton = document.querySelector("#new-file");
const openFileButton = document.querySelector("#open-file");
const saveMarkdownButton = document.querySelector("#save-markdown");
const revertButton = document.querySelector("#revert");
const saveHtmlButton = document.querySelector("#save-html");
const showFileButton = document.querySelector("#show-file");
const openInDefaultButton = document.querySelector("#open-in-default");

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

// updates current title on any window
// similar to vs code where you're changing which file
const updateUserInterface = isEdited => {
  // if unsaved changes
  // basically original content not equaling content
  // then there's a diff

  // maybe enable the revert button
  // let's figure out how to change app title

  let title = "Fire Sale";
  let editStatus = "";

  // currently filePath null is falsy
  if (filePath) {
    // path simplifies
    title = `${path.basename(filePath)} - ${title}`;
  }

  // remember: updating the render process does not
  // require a restart terminal
  // can just restart the window
  // changing the main process does require terminal restart

  if (isEdited) {
    title = `${title} (Edited)`;
  }

  // for mac os
  // show represented file icon next to top name
  currentWindow.setRepresentedFilename(filePath);
  currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;

  currentWindow.setTitle(title);
};

markdownView.addEventListener("keyup", event => {
  const currentContent = event.target.value;

  isEdited = currentContent !== originalContent;

  renderMarkdownToHtml(currentContent);
  updateUserInterface(isEdited);
});

openFileButton.addEventListener("click", () => {
  mainProcess.getFileFromUser();
});

// channel of arbitrary name
ipcRenderer.on("file-opened", (event, file, content) => {
  // scoping
  // setting the two global variables
  filePath = file;
  originalContent = content;

  // sending from main to renderer process
  // console.log({ file, content });
  markdownView.value = content;
  renderMarkdownToHtml(content);

  // update title on native app
  updateUserInterface();
});
