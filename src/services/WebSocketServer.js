const ControlPlaneWS = require('./ws/ControlPlaneWS');
const WSRelay = require('./ws/WSRelay');

module.exports = function(request, socket, head) {
    try {
        const reqURL = new URL(request.url, 'http://example.com');

        if(reqURL.pathname === '/controlplane'){
            ControlPlaneWS.handleUpgrade(request, socket, head, reqURL);
        }
        else if (reqURL.pathname.startsWith('/relay')){
            WSRelay.handleUpgrade(request, socket, head, reqURL);
        }
        else {
            return socket.destroy();
        }

    }
    catch(e){
        console.error("Websocket server error", e);
        return socket.destroy();
    }

}