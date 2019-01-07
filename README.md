# mystic

## Important files
Websocket server: /src/main.go
Game server: /src/main.rs
Client root js file: /src/client/js/client.js
Index file is obviously: /src/client/index.html

Everything is processed and put into /dist/ thanks to gulp.

=======

## How to setup a new server
1) Install go and node.js. If you're on modern Ubuntu use snap b/c it's easiest:
    sudo snap install go --classic
    sudo snap install --edge node --classic

2) Install rust:
    sudo apt install curl
    sudo curl https://sh.rustup.rs -sSf | sh

## How to build server
1) Clone this project: 
    git-hub pull nepphhh/mystic

2) Enter the folder: 
    cd ./mystic

3) Now setup all dependencies:
    npm install
    go get github.com/gorilla/websockets

4) You should be able to build and run it now (make sure you're in the main directory):
    gulp & ./dist/ws-server (Linux)
    gulp; ./dist/ws-server.exe (Windows, in Powershell)
