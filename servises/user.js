users = [];

exports.create = (user) => {
    users.push(user);
};
exports.all = (cb) => {
    cb(users);
};

