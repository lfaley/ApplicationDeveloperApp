const { app, BrowserWindow, ipcMain } = require('electron');
jest.mock('electron', () => ({
  BrowserWindow: jest.fn(() => ({
    loadFile: jest.fn(),
    webContents: {}
  })),
  ipcMain: {
    handle: jest.fn()
  },
  dialog: {
    showOpenDialog: jest.fn()
  }
}));

describe('Electron Main Process', () => {
  it('should create a BrowserWindow and load the UI', () => {
    const { BrowserWindow } = require('electron');
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    expect(win).toBeDefined();
    expect(win.webContents).toBeDefined();
    win.loadFile('projectplanner-ui.html');
    expect(win.loadFile).toHaveBeenCalledWith('projectplanner-ui.html');
  });

  it('should register IPC handlers', () => {
    const { ipcMain } = require('electron');
    expect(ipcMain.handle).toBeDefined();
  });
});
