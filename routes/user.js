const router = require('express').Router();
const userService = require('../servises/user');

router.post('/user', (req, res) => {
    userService.create(req.body);
    res.end();
});
router.get('/user', (req, res) => {
    userService.all((data) => {
        res.send(data);
    });
});
module.exports = router;
