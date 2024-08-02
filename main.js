const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const { spawn } = require('child_process');
const { log } = require('node:console');


function startServer() {
    const serverProcess = spawn('node', ['index.js']);

    //listener para o fluxo de saída padrão do servidor
    serverProcess.stdout.on('data', (data) => {
        console.log(`servidor Node.js: ${data}`);
    });

    //listener para o fluxo de erro do servidor
    serverProcess.stderr.on('data', (data) => {
        console.log(`Erro no servidor Node.js ${data}`);
    });

    //listener para o evento 'close' do processo filho
    serverProcess.on('close', (code) => {
        console.log(`Servidor Node.js encerrado com código ${code}`);
    });

    //reorna o objeto para que possa interagir com ele se necessário
    return serverProcess;
}



function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadURL('http://localhost:3000')
}



app.whenReady().then(() => {
    //inicia utilizando o servidor node
    const serverProcess = startServer();
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
    //encerra o servidor node quando o electron for fechado 
    app.on('before-quit', () => {
serverProcess.kill();
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})