const nJwt = require('nJwt');

const UserController = require('../controllers/UserController');
const TenantController = require('../controllers/TenantController');

const permissions = {};

permissions.isUser = function(req, res, next) {
    if(!req.headers["authorization"] || !req.headers["authorization"].startsWith("Bearer ")){
        return res.json({
            status: 401,
            message: "Authorization required."
        })
    }

    const {"authorization": accessToken} = req.headers;

    nJwt.verify(accessToken.substring(7, accessToken.length), process.env.JWT_KEY, function(err, verifiedJwt) {
        if(err){
            return res.json({
                status: 403,
                message: "Invalid token."
            })
        }
        req.user = verifiedJwt.body.user;
        return next();
    })
}

permissions.isUserInTenant = function(req, res, next) {

}

module.exports = permissions;