const sendMessage = (socket, eventName, data) => {
    // console.log('SEND MESSAGE', socket, eventName, data);
    if (socket && socket.connected) {
        socket.emit(eventName, data);
    } else {
        console.error('Socket không tồn tại hoặc chưa kết nối');
    }
};

const listenEvent = (socket, eventName, callback) => {
    if (socket && socket.connected) {
        socket.on(eventName, callback);
    } else {
        console.error('Socket không tồn tại hoặc chưa kết nối');
    }
};

const removeListener = (socket, eventName, callback) => {
    if (socket && socket.connected) {
        socket.off(eventName, callback);
    } else {
        console.error('Socket không tồn tại hoặc chưa kết nối');
    }
};

export { sendMessage, listenEvent, removeListener };
