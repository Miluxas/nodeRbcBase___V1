const { sendGridKey } = require('./config');

module.exports = { sendVerifyEmail,sendTransferVerifyEmail };

function sendVerifyEmail(userEmail, authCode) {

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(sendGridKey);
    const msg = {
        to: userEmail,
        from: 'info@intelligent-trader.com',
        subject: 'Intelligent Trader System verification',
        text: 'Please confirm your email with this link',
        html:
            `<h4><span style="color: #000000;">Dear Investor</span></h4>
            <h4><br /><strong>Please confirm your email with this link</strong></h4>
            <h4><strong>
                <a href="https://intelligenttraderbd.appspot.com/users/emailverification?email=${userEmail}&authCode=${authCode}" target="_blank" rel="noopener">Verification Link</a></strong></h4>
            <h4><br /><strong><span style="color: #000000;">Best regards</span></strong><br /><strong>Intelligent Trader System </strong></h4>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p style="text-align: center;">
                <strong>&nbsp;This mail send by intelligent system. If you don't register in <a href="https://www.intelligent-trader.sys">www.intelligent-trader.sys</a> please ignore this mail.<br /></strong></p>`,
    };
    sgMail.send(msg);


}



function sendTransferVerifyEmail(userEmail,srcAccountNumber, secretKey,destAccountNumber,value) {

    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(sendGridKey);
    const msg = {
        to: userEmail,
        from: 'verification@intelligent-trader.com',
        subject: 'Intelligent Trader System verification',
        text: 'Please confirm your transfer order with this link',
        html:
            `<h4><span style="color: #000000;">Dear Investor</span></h4>
            <h4><br /><strong>Please confirm your transfer order with this link</strong></h4>
            <h4><br /><strong>TRANSFER   USD$ ${value}  FROM  ${srcAccountNumber}   TO   ${destAccountNumber}   </strong></h4>
            <h4><strong>
                <a href="https://intelligenttraderbd.appspot.com/accounting/verifyTransferOrderOnSrc?srcAccountNumber=${srcAccountNumber}&secretKey=${secretKey}" target="_blank" rel="noopener">Transfer Order Verification Link</a></strong></h4>
            <h4><br /><strong><span style="color: #000000;">Best regards</span></strong><br /><strong>Intelligent Trader System </strong></h4>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p style="text-align: center;">
                <strong>&nbsp;This mail send by intelligent system. If you don't register a transfer order in <a href="https://www.intelligent-trader.sys">www.intelligent-trader.sys</a> please ignore this mail.<br /></strong></p>`,
    };
    sgMail.send(msg);


}