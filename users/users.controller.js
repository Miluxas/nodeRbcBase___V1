const express = require('express');
const router = express.Router();
const userService = require('./users.service');
const authorize = require('../_helpers/authorize')

// routes
router.post('/register', registerNewUser);                  // register new user
router.post('/authenticate', authenticate);                 // authenticate users
router.get('/emailverification', verifyEmail);             // verify user email
router.get('/test',test)

router.get('/', authorize(), getAll);                       // get all users
router.get('/:id', authorize(), getById);                   // get a user

module.exports = router;

function authenticate(req, res, next) {
    
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function registerNewUser(req, res, next) {
    var ip= req.header('x-forwarded-for') || req.connection.remoteAddress
   // console.log(req.connection.remoteAddress)
    userService.registerNewUser(req.body.email,req.body.password,ip,req.body.refcode)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function verifyEmail(req, res, next) {
    userService.verifyEmail(req.query.email,req.query.authCode)
        .then(user => user ? res.json(user) : res.status(400).json({ message: "Data isn't correct" }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function test(req, res, next) {
    console.log('dfsdfasdf')
    res.status(200).json({title:'test'})
}

function getById(req, res, next) {
    const currentUser = req.user;
    const id = parseInt(req.params.id);
    console.log(req.user)
    // only allow admins to access other user records
    if (id !== currentUser.sub ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}