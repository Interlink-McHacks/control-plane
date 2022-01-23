const nJwt = require('njwt');

const UserController = require('../controllers/UserController');
const TenantController = require('../controllers/TenantController');

const permissions = {};

function validateUser(token) {
    return new Promise((resolve, reject) => {
        nJwt.verify(token.substring(7, token.length), process.env.JWT_KEY, function(err, verifiedJwt) {
            if(err){
                return reject("Invalid token");
            }
            resolve(verifiedJwt.body.user);
        })
    });
}

permissions.isUser = async function(req, res, next) {
    if(!req.headers["authorization"] || !req.headers["authorization"].startsWith("Bearer ")){
        return res.json({
            status: 401,
            message: "Authorization required."
        })
    }

    const {"authorization": accessToken} = req.headers;

    try {
        req.user = await validateUser(accessToken);
        return next();
    }
    catch(err) {
        return res.json({
            status: 403,
            message: "Invalid token."
        })
    }
}

permissions.isUserInTenant = async function(req, res, next) {
    if(!req.headers["authorization"] || !req.headers["authorization"].startsWith("Bearer ")){
        return res.json({
            status: 401,
            message: "Authorization required."
        })
    }

    const {"authorization": accessToken} = req.headers;
    const tenantID = req.params.tenantID;

    if(!tenantID) {
        return res.json({
            status: 400,
            message: "No Tenant specified."
        })
    }

    try {
        req.user = await validateUser(accessToken);

        for(const acl of req.user.acls){
            if (acl["tenantID"] === tenantID) {
                return next();
            }
        }

        return res.json({
            status: 403,
            message: "User does not have permission to access the tenant."
        })
    }
    catch(err) {
        return res.json({
            status: 403,
            message: "Invalid token."
        })
    }
}

module.exports = permissions;