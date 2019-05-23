const config = require('../_helpers/config');
const jwt = require('jsonwebtoken');
const { Run } = require('../_helpers/db')
var passwordHash = require('password-hash');

const {sendVerifyEmail} = require('../_helpers/email-handler')
const rbacService = require('../rbac/rbac.service');

module.exports = {
    authenticate,
    verifyEmail,
    registerNewUser
};

async function authenticate({ username, password }) {

    var rows = await Run(`CALL userAuth("${username}")`)

    if (rows.length > 0 && rows[0].length > 0) {
        if (passwordHash.verify(password, rows[0][0].password_hash)) 
        {
            var userRoles = ['guest']
            rows[1].forEach(element => {
                userRoles.push(element.item_name)// console.log(element.item_name)
            });
            var user = {
                id: rows[0][0].id,
                username: rows[0][0].username,
                firstName: 'first name',
                lastName: 'lastname',
                roles: userRoles,
            }
            //console.log(user)
            const token = jwt.sign({ sub: user.id, role: user.roles }, config.secret);
            //console.log(token)
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                token
            };
        }
    }
}

async function registerNewUser(email, password,registrationIp,refcode) {
    var hashedPassword = passwordHash.generate(password);
    var rows = await Run(`CALL registerNewUser(
        '${email}', '${hashedPassword}', '${registrationIp}','${refcode}')`);
        console.log(rows[0])
        console.log(rows[1])
    if(rows[0][0].result==="user created")    
        sendVerifyEmail(email,rows[1][0].authKey)
    return rows
}

async function verifyEmail(email, authKey) {
    var rows = await Run(`CALL verifyUser(
        '${email}', '${authKey}')`);
        //console.log(rows)
    if(rows[0][0] && rows[0][0].userId>0)
    {
        //console.log(rows[0][0].userId)
        rbacService.assignRoleToUser('user',rows[0][0].userId)
        return true}
    return false
}