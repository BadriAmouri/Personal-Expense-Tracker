const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    addExpense: (name, price) => ipcRenderer.invoke('add-expense', name, price),
    deleteExpense: (id) => ipcRenderer.invoke('delete-expense', id),
    getExpenses: () => ipcRenderer.invoke('get-expenses'),
    loadExpenses: (callback) => ipcRenderer.on('load-expenses', callback)
});
