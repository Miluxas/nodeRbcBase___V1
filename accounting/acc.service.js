const {Run}=require('../_helpers/db')

module.exports = {
    //registerPayment,
    getTransactionsList,
    getAccountInfo,
    getSystemInfo,
    getDestUnverifiedTransferOrderList,
    getUnverifiedTransferOrderList,
    addTransferOrder,
    verifyTransferOrderOnDest,
    verifyTransferOrderOnSrc,
    deleteTransferOrder

};

async function getTransactionsList(userId) {
    return await Run(`SELECT acc_transaction.*,date_format(create_at,'%Y-%m-%d %h:%i:%s') as createAt FROM acc_transaction inner join acc_account
     on acc_transaction.account_id=acc_account.id where acc_account.user_id=${userId}
     order by acc_transaction.id desc `)
}

async function getAccountInfo(userId) {
    return await Run(`CALL getAccountInfo(${userId})`)
}

async function getSystemInfo() {
    return await Run(`CALL getSystemInfo()`)
}

async function addTransferOrder(userId,destAccountNumber,value,comment) {
    return await Run(`call addTransferOrder(${userId}, '${destAccountNumber}', ${value}, '${comment}');`)
}


async function getDestUnverifiedTransferOrderList(userId) {
    return await Run(`SELECT transfer_order.id,acc_account.code,transfer_order.value,transfer_order.create_at 
    FROM transfer_order inner join acc_account on transfer_order.account_id=acc_account.id
    where transfer_order.dest_user_id=${userId} and transfer_order.dest_verify_at is null`)
}

async function getUnverifiedTransferOrderList(userId) {
    return await Run(`SELECT transfer_order.id,acc_account.code,transfer_order.value,transfer_order.create_at,
    transfer_order.dest_verify_at,transfer_order.verify_at,transfer_order.dest_verify_code 
    FROM transfer_order inner join acc_account on transfer_order.dest_account_id=acc_account.id
    where transfer_order.user_id=${userId} and transfer_order.dest_verify_at is null`)
}

async function verifyTransferOrderOnDest(userId,srcAccountNumber,destVerifyCode) {
    return await Run(`CALL verifyTransferOrderOnDest(${userId},'${srcAccountNumber}','${destVerifyCode}')`)
}


async function verifyTransferOrderOnSrc(srcAccountNumber,secretKey) {
    return await Run(`CALL verifyTransferOrderOnSrc('${srcAccountNumber}','${secretKey}');
    `)
}

async function deleteTransferOrder(userId,orderId) {
    return await Run(`CALL deleteTransferOrder(${userId},${orderId})`)
}

