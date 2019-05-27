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

/**
 * Authenticate User
 * @param {string,string} param0 {username,password}
 */
async function authenticate({ username, password }) {
    // Call a store procedure from db and get result
    var result = await Run(`CALL userAuth("${username}")`)
    if (result.length > 0 && result[0].length > 0) {
        // If find any user check password
        if (passwordHash.verify(password, result[0][0].password_hash)) 
        {
            // Add roles of user to array
            var userRoles = ['guest']
            result[1].forEach(element => {
                userRoles.push(element.item_name)
            });
            // Create user object
            var user = {
                id: result[0][0].id,
                username: result[0][0].username,
                firstName: 'first name',
                lastName: 'lastname',
                roles: userRoles,
            }
            // Create JWT token
            const token = jwt.sign({ sub: user.id, role: user.roles }, config.secret);
            // Remove password from user object
            const { password, ...userWithoutPassword } = user;
            return {
                ...userWithoutPassword,
                token
            };
        }
    }
}

/**
 * Register New User in system
 * @param {string} email Email
 * @param {string} password Password
 * @param {string} registrationIp Register system IP
 * @param {string} refcode Refrence code
 */
async function registerNewUser(email, password,registrationIp,refcode) {
    // produce a hashed password from password
    var hashedPassword = passwordHash.generate(password);
    var rows = await Run(`CALL registerNewUser(
        '${email}', '${hashedPassword}', '${registrationIp}','${refcode}')`);
    
    // check is user created
    if(rows[0][0].result==="user created")
    {    
        // Send verification Email to user Email
        sendVerifyEmail(email,rows[1][0].authKey)
        return true
    }
    return false
}

/**
 * After user click on the verification link in email, this function
 * will run and register user verification
 * @param {string} email Email
 * @param {string} authKey Authentication Key
 */
async function verifyEmail(email, authKey) {
    var rows = await Run(`CALL verifyUser(
        '${email}', '${authKey}')`);
    // If user verify successfully then assign role to it
    if(rows[0][0] && rows[0][0].userId>0)
    {
        rbacService.assignRoleToUser('user',rows[0][0].userId)
        return true
    }
    return false
}