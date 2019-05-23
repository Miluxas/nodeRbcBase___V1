const router = require('express').Router();
const bitcoinService = require('./bitcoin.service');
const authorize = require('../../_helpers/authorize')

// routes
router.post('/addPayment', authorize(), addPayment);                // add a payment order
router.get('/setPaymentResult', setPaymentResult);                  // set payment result. act with api

module.exports = router;


function addPayment(req, res, next) {

    var secretKey = require("crypto").randomBytes(20).toString('hex')+Date.now();
    var value= req.body.value
    var userId=req.user.sub

    bitcoinService.addPayment(userId,value,secretKey)
        .then(res1=>{
            if(res1.affectedRows===1){
                var query={
                    sk:secretKey,
                    ui:userId,
                    vl:value
                }
                var setPayRes='http://localhost:4000/payment/setPaymentResult'
                bitcoinService.createReceive(setPayRes,query).then(result=>{
                   // console.log(result)
                    result={address:'16Jw9o89XW7rhb7WZHTakhLr8w1pLszKW'}
                    res.json(result)
                    //return res
                   // return '16Jw9o89XW7rhb7WZHTakhLr8w1pLszKW'
                })
            }
            //console.log(res.affectedRows)
        })
        .catch(err=>next(err))
}

function setPaymentResult(req, res, next) {
    secretKey='2f3ce36f08beaef931f18d2c08c0837618c406c81557592874077'
    userId=3
    value=1480000 
    bitcoinService.setResult(secretKey,userId,value)
        .then(t=>res.json(t))
        .catch(err=>next(err))
}

