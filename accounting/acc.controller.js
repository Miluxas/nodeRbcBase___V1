const router = require('express').Router();
const accService = require('./acc.service');
const authorize = require('../_helpers/authorize')
const {sendTransferVerifyEmail} =require('../_helpers/email-handler')

// routes
router.get('/verifyTransferOrderOnSrc', verifyTransferOrderOnSrc);
router.post('/getTransactionList', authorize(), getTransactionsList);
router.post('/getAccountInfo', authorize(), getAccountInfo);
router.post('/getSystemInfo', authorize(), getSystemInfo);
router.post('/addTransferOrder', authorize(), addTransferOrder);
router.post('/getDestUnverifiedTransferOrderList', authorize(), getDestUnverifiedTransferOrderList);
router.post('/getUnverifiedTransferOrderList', authorize(), getUnverifiedTransferOrderList);
router.post('/verifyTransferOrderOnDest', authorize(), verifyTransferOrderOnDest);
router.post('/deleteTransferOrder', authorize(), deleteTransferOrder);


module.exports = router;


function getTransactionsList(req, res, next) {
    const currentUser = req.user;
    accService.getTransactionsList(currentUser.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getAccountInfo(req, res, next) {
    const currentUser = req.user;
    accService.getAccountInfo(currentUser.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getSystemInfo(req, res, next) {
    accService.getSystemInfo()
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function addTransferOrder(req, res, next) {
    const currentUser = req.user;
    accService.addTransferOrder(currentUser.sub,req.body.destAccountNumber,req.body.value,req.body.comment)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getDestUnverifiedTransferOrderList(req, res, next) {
    const currentUser = req.user;
    accService.getDestUnverifiedTransferOrderList(currentUser.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function getUnverifiedTransferOrderList(req, res, next) {
    const currentUser = req.user;
    accService.getUnverifiedTransferOrderList(currentUser.sub)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function verifyTransferOrderOnDest(req, res, next) {
    const currentUser = req.user;
    accService.verifyTransferOrderOnDest(currentUser.sub,req.body.srcAccountNumber,req.body.destVerifyCode)
        .then(result=>{

            if(result[0][0].status===1)
            {   
                var data=result[0][0]
                sendTransferVerifyEmail(data.email,data.src_account_number,data.secret_key,data.dest_account_number,data.value);
                return res.json([[{
                    status: 1,
                    message: 'Transfer Verified on the dest'}]])
            }
            return res.json(result)})
        .catch(err=>next(err))
}

function verifyTransferOrderOnSrc(req, res, next) {
    accService.verifyTransferOrderOnSrc(req.query.srcAccountNumber,req.query.secretKey)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}

function deleteTransferOrder(req, res, next) {
    const currentUser = req.user;
    accService.deleteTransferOrder(currentUser.sub,req.body.orderId)
        .then(result=>res.json(result))
        .catch(err=>next(err))
}
