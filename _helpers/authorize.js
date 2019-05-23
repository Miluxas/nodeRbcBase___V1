const expressJwt = require('express-jwt');
const { secret } = require('../_helpers/config');
const { Run } = require('../_helpers/db')

module.exports = authorize;

function authorize() {

    return [
        expressJwt({secret}),
        async (req, res, next) => {
            //console.log("auth try")
            var rows = await Run(`CALL userAccessControl(${req.user.sub},"${req.originalUrl}")`)
            //console.log(rows)
            if (rows.length > 0 && rows[0][0].cn > 0)
                {
                    //console.log('access is ok')
                    next();
                }
            else
                return res.status(401).json({ message: 'Unauthorized' });
        }
    ];
}