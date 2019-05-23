var _socket=null;
module.exports = { setSocketServer ,emit};

function setSocketServer(server) {
    _socket = require("socket.io")(server)
}

function emit(event, args)
{
    _socket.emit(event, args);
}