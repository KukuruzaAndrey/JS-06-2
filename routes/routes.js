const user = require('./user');
const message = require('./message');
module.exports = app => {
    app.use(user);
    app.use(message);
};