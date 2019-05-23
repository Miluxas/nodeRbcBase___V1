const {Run}=require('../../_helpers/db')
var Receive = require('blockchain.info/Receive')
var config=require('../../_helpers/config')
var exchange = require('blockchain.info/exchange')

module.exports = {
    createReceive,
    addPayment,
    setResult
};

/**
 * create a receive 
 * @param {string} callback Callback url
 */
async function createReceive(callback,query) {
    //console.log(config.payment.bitcoin.xpub)
    var  myReceive= new Receive(config.payment.bitcoin.xpub, callback, config.payment.bitcoin.key)
    return await myReceive.generate(query)
}

/**
 * add a payment to table
 * @param {number} user_id User Id
 * @param {decimal} value Value
 * @param {string} secret_key secret key
 */
async function addPayment(user_id,value,secret_key) {
    //user_id=2
    return await Run(`CALL addPaymentOrder(${user_id}, 10,${value}, '${secret_key}')`)
}

/**
 * set result of payment
 * @param {string} secretKey Payment secret key
 * @param {integer} userId User Id
 * @param {number} value value in satoshi
 */
async function setResult(secretKey,userId,value) {
    await exchange.fromBTC(100000000, 'USD').then(async(rate)=>{
        return await Run(`CALL getPaymentResult('${secretKey}', ${userId}, ${value/100000000}, 10, ${rate})`)
    })
    //console.log(rate)
    //
}

