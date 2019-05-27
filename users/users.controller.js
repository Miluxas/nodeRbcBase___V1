const express = require('express')
const router = express.Router()
const userService = require('./users.service')


router.post('/register', registerNewUser);                  // register new user
router.post('/authenticate', authenticate);                 // authenticate users
router.get('/emailverification', verifyEmail);              // verify user email

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(data => data ? res.json(data) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function registerNewUser(req, res, next) {
    var ip= req.header('x-forwarded-for') || req.connection.remoteAddress
    userService.registerNewUser(req.body.email,req.body.password,ip,req.body.refcode)
        .then(data => data ? res.json(data) : res.status(400).json({ message: 'Something is wrong' }))
        .catch(err => next(err));
}

function verifyEmail(req, res, next) {
    userService.verifyEmail(req.query.email,req.query.authCode)
        .then(data => data ? res.json(data) : res.status(400).json({ message: "Data isn't correct" }))
        .catch(err => next(err));
}
