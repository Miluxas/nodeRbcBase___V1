const mysql = require('mysql')
const util = require('util')

module.exports = {
    Run
};
 
const pool = mysql.createPool({
    user: 'username',
    password: 'password',
    database: 'database name',
    socketPath:"",
    connectionLimit:100,
   
})

function Run(query){
    pool.query = util.promisify(pool.query)
    //console.log(query)
    return pool.query(query)
}