const router = require('express').Router();
const coinbaseService = require('./coinbase.service');
const authorize = require('../../_helpers/authorize')

// routes
router.post('/addPayment', authorize(), addPayment);                // add a payment order
router.get('/setPaymentResult', setPaymentResult);                  // set payment result. act with api 
router.get('/cancelPayment', cancelPayment);                  // set payment result. act with api cancelPayment

module.exports = router;


function addPayment(req, res, next) {

    var secretKey = require("crypto").randomBytes(20).toString('hex')+Date.now();
    var value= req.body.value
    var userId=req.user.sub

    coinbaseService.addPayment(userId,value,secretKey)
    .then(t=>{
        //console.log( t.hosted_url)
        res.json(t.hosted_url)})

}

function setPaymentResult(req, res, next) {
    console.log('set payment result')
    console.log(req)
    /*secretKey='2f3ce36f08beaef931f18d2c08c0837618c406c81557592874077'
    userId=3
    value=1480000 
    coinbaseService.setResult(secretKey,userId,value)
        .then(t=>res.json(t))
        .catch(err=>next(err))*/
}

function cancelPayment(req, res, next) {
    console.log('cancel payment')
    console.log(req.header)
    /*secretKey='2f3ce36f08beaef931f18d2c08c0837618c406c81557592874077'
    userId=3
    value=1480000 
    coinbaseService.setResult(secretKey,userId,value)
        .then(t=>res.json(t))
        .catch(err=>next(err))*/
}

