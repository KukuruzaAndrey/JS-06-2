const router = require('express').Router();
const msgService = require('../servises/message');

router.post('/msg', (req, res) => {
    msgService.create(req.body, () => {
        res.end();
    });
});
router.get('/msg', (req, res) => {
    msgService.all((data) => {
        res.send(data);
    });
});

module.exports = router;
