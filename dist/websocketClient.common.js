function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "connectToWebSocketServer", () => $3c21965c92bb175f$export$dba0604e35f48f71);
function $3c21965c92bb175f$var$createEventEmitter() {
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
function $3c21965c92bb175f$var$createRoom(url, roomType, roomId) {
    const emitter = $3c21965c92bb175f$var$createEventEmitter();
    const ws = new WebSocket(url + "/" + roomType + "/" + roomId);
    let state = {};
    function handleMessage(event) {
        const data = JSON.parse(event.data);
        switch(data.type){
            case "patch":
                Object.assign(state, data.value);
                emitter.emit("state", state);
                break;
            case "state":
                state = data.value;
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
function $3c21965c92bb175f$export$dba0604e35f48f71(url) {
    return {
        getRoom (roomType, roomId) {
            return $3c21965c92bb175f$var$createRoom(url, roomType, roomId);
        }
    };
}


//# sourceMappingURL=websocketClient.common.js.map
