function $d2b38d6a7f8bb4d2$var$createEventEmitter() {
    const callbacks = {};
    return {
        on (type, handler) {
            if (!callbacks[type]) callbacks[type] = [];
            callbacks[type].push(handler);
        },
        emit (type, ...args) {
            if (callbacks[type]) callbacks[type].forEach((handler)=>{
                handler(...args);
            });
        }
    };
}
function $d2b38d6a7f8bb4d2$var$createRoom(url, roomType, roomId) {
    const emitter = $d2b38d6a7f8bb4d2$var$createEventEmitter();
    const ws = new WebSocket(url + "/" + roomType + "/" + roomId);
    let state = {};
    function handleMessage(event) {
        const data = JSON.parse(event.data);
        console.log(data);
        switch(data.type){
            case "patch":
                Object.assign(state, data.value);
                console.log(state, data.value);
                emitter.emit("state", state);
                break;
            case "state":
                state = data.value;
                console.log(state, data.value);
                emitter.emit("state", state);
                break;
            default:
                throw new Error("Invalid message type sent by server.");
        }
    }
    function handleClose(event) {
        emitter.emit("close", event.reason);
    }
    ws.addEventListener("close", handleClose);
    ws.addEventListener("message", handleMessage);
    return {
        onStateChange (callback) {
            emitter.on("state", callback);
        },
        onClose (callback) {
            emitter.on("close", callback);
        },
        send (type, value) {
            ws.send(JSON.stringify({
                type: type,
                value: value
            }));
        },
        close () {
            ws.close();
        }
    };
}
function $d2b38d6a7f8bb4d2$export$dba0604e35f48f71(url) {
    return {
        getRoom (roomType, roomId) {
            return $d2b38d6a7f8bb4d2$var$createRoom(url, roomType, roomId);
        }
    };
}


export {$d2b38d6a7f8bb4d2$export$dba0604e35f48f71 as connectToWebSocketServer};
//# sourceMappingURL=websocketClient.module.js.map
