function createEventEmitter() {
  const callbacks = {};
  return {
    on(type: string, handler: Function) {
      if (!callbacks[type]) {
        callbacks[type] = [];
      }
      callbacks[type].push(handler);
    },

    emit(type: string, ...args: any[]) {
      if (callbacks[type]) {
        callbacks[type].forEach((handler: Function) => {
          handler(...args);
        });
      }
    }
  };
}

function createRoom(url: string, roomType: string, roomId: string) {
  const emitter = createEventEmitter();
  const ws = new WebSocket(url + '/' + roomType + '/' + roomId);
  let state = {};

  function handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'patch':
        Object.assign(state, data.value);
        emitter.emit('state', { ...state });
        break;
      case 'state':
        state = data.value;
        emitter.emit('state', { ...state });
        break;
      default:
        throw new Error('Invalid message type sent by server.');
    }
  }

  function handleClose(event: CloseEvent) {
    emitter.emit('close', event.reason);
  }

  ws.addEventListener('close', handleClose);
  ws.addEventListener('message', handleMessage);

  return {
    onStateChange(callback: (state: any) => void) {
      emitter.on('state', callback);
    },

    onClose(callback: () => void) {
      emitter.on('close', callback);
    },

    send(type: string, value: any) {
      ws.send(
        JSON.stringify({
          type,
          value
        })
      );
    },

    close() {
      ws.close();
    }
  };
}

export function connectToWebSocketServer(url: string) {
  return {
    getRoom(roomType: string, roomId: string) {
      return createRoom(url, roomType, roomId);
    }
  };
}
