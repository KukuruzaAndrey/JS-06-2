const messages = [];
exports.create = (msg) => {
    messages.push(msg);
    if (messages.length > 100) {
        messages.shift();
    }
};
exports.all = (cb) => {
    cb(messages);
};
