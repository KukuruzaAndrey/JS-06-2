const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/', express.static(`${__dirname}/public`));
require('./routes/routes')(app);


http.listen(3000, () => {
    console.log('listening on *:3000');
});
