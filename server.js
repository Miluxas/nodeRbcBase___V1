require('rootpath')();
const express = require('express');
const app = express();
//const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');
const {setSocketServer}=require('./_helpers/socket-handler')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials","true"); 
    res.header('Access-Control-Allow-Methods', 'GET, DELETE, PUT,POST,OPTION');
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, nosniff, Authorization, X-XSS-Protection, X-Frame-Options, Content-Security-Policy, Strict-Transport-Security");
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Content-Security-Policy', " default-src 'none'; frame-ancestors 'none'");
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Strict-Transport-Security', 'max-age=63072000');
    next();
  });

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/rbac', require('./rbac/rbac.controller'));
app.use('/payment', require('./payment/coinbase/coinbase.controller'));
app.use('/accounting', require('./accounting/acc.controller'));

app.get('/', (req, res) => {

    res.status(200).send("Wellcome To Miluxas Core Backend Server")
    });
// global error handler
app.use(errorHandler);
app.use (function (req, res, next) {
    if (req.secure) {
            // request was via https, so do no special handling
            next();
    } else {
            // request was via http, so redirect to https
            res.redirect('https://' + req.headers.host + req.url);
    }
});

// start server
const port =8080// process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
setSocketServer(server);