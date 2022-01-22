const WebSocket = require('faye-websocket')

module.exports = {
    handleUpgrade(request, socket, head, reqURL) {
        const queryObject = reqURL.searchParams;
        const token = queryObject.get('token');

        // TODO: verify the token is assigned to a host

        if (WebSocket.isWebSocket(request)) {
            const wss = new WebSocket(request, socket, head);
        }
    }
}