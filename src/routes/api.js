const express = require("express");
const router = express.Router();

const UserController = require('../controllers/UserController');
const TenantController = require('../controllers/TenantController');
const HostController = require('../controllers/HostController');
const DNSController = require('../controllers/DNSController');

const permissions = require('../services/permissions');

const IPMatch = new RegExp("^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$");

router.post('/login', (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({
            status: 400,
            error: "No email or no password specified."
        })
    }

    UserController.login(req.body.email, req.body.password).then((loginRes) => {
        return res.json({
            status: 200,
            message: "OK",
            data: {
                token: loginRes.token,
                user: loginRes.user
            }
        })
    }).catch((err) => {
        console.error("login error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.get('/user', permissions.isUser, (req, res) => {
    UserController.getUser(req.user.id).then((user) => {
        return res.json({
            status: 200,
            message: "OK",
            data: {
                user: user
            }
        })
    }).catch((err) => {
        console.error("fetch user error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.get('/user/acls', permissions.isUser, (req, res) => {
    UserController.getUserACLs(req.user.id).then((userACLs) => {
        return res.json({
            status: 200,
            message: "OK",
            data: {
                acls: userACLs
            }
        })
    }).catch((err) => {
        console.error("fetch user acl error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    });
})

router.post('/user', (req, res) => {
    if(!req.body.email || !req.body.password || !req.body.name) {
        return res.status(400).json({
            status: 400,
            error: "No email or no password or no name specified."
        })
    }

    UserController.createUser(req.body.email, req.body.password, req.body.name).then((user) => {
        return res.json({
            status: 200,
            message: "OK"
        })
    }).catch((err) => {
        console.error("create user error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.delete('/user/:userID', (req, res) => {

})

router.get('/tenant/:tenantID', permissions.isUserInTenant, (req, res) => {
    TenantController.getTenant(req.params.tenantID).then((tenant) => {
        return res.json({
            status: 200,
            message: "OK",
            data: tenant
        })
    }).catch((err) => {
        console.error("get tenant error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.get('/tenant/:tenantID/acls', permissions.isUserInTenant, (req, res) => {
    TenantController.getACLs(req.params.tenantID).then((tenantACLs) => {
        return res.json({
            status: 200,
            message: "OK",
            data: tenantACLs
        })
    }).catch((err) => {
        console.error("get tenant users error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.post('/tenant', permissions.isUser, (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({
            status: 400,
            error: "No tenant name specified."
        })
    }

    TenantController.createTenant(req.body.name).then((tenant) => {
        TenantController.createACL(tenant.id, req.user.id).then(() => {
            return res.json({
                status: 200,
                message: "OK",
                data: {
                    id: tenant.id,
                    joinToken: tenant.joinToken
                }
            })
        }).catch((err) => {
            console.error('create acl after tenant create error', err);
            return res.status(500).json({
                status: 500,
                error: err.message
            })
        })
    }).catch((err) => {
        console.error('tenant create error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.post('/tenant/:tenantID/user', permissions.isUserInTenant, (req, res) => {
    if(!req.body.userID) {
        return res.status(400).json({
            status: 400,
            error: "No userID specified."
        })
    }

    TenantController.createACL(req.params.tenantID, req.body.userID).then(() => {
        return res.json({
            status: 200,
            message: "OK"
        });
    }).catch((err) => {
        console.error('tenant acl create error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.delete('/tenant/:tenantID/user/:userID', permissions.isUserInTenant, (req, res) => {
    TenantController.deleteACL(req.params.tenantID, req.params.userID).then(() => {
        return res.json({
            status: 200,
            message: "OK"
        });
    }).catch((err) => {
        console.error('tenant acl delete error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.post('/tenant/:tenantID/host', (req, res) => {
    // must include tenant jointoken in body
    if(!req.body.joinToken || !req.body.name){
        return res.json({
            status: 401,
            error: "name and joinToken is required."
        })
    }

    TenantController.getJoinToken(req.params.tenantID).then((joinToken) => {
        if(joinToken === req.body.joinToken){
            HostController.createHost(req.params.tenantID, req.body.name).then((host) => {
                return res.json({
                    status: 200,
                    message: "OK",
                    data: host
                })
            }).catch((err) => {
                console.error('create host error', err);
                return res.status(500).json({
                    status: 500,
                    error: err.message
                })
            })
        }
        else {
            return res.status(403).json({
                status: 403,
                error: "Invalid joinToken."
            })
        }
    }).catch((err) => {
        console.error('create host get join token error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.get('/tenant/:tenantID/host/:hostID', permissions.isUserInTenant, (req, res) => {

})

router.get('/tenant/:tenantID/host/:hostID/cmd', (req, res) => {

})

router.delete('/tenant/:tenantID/host/:hostID', (req, res) => {

})


router.post('/tenant/:tenantID/tunnel', (req, res) => {

})

router.get('/tenant/:tenantID/tunnel/:tunnelID', (req, res) => {

})


router.delete('/tenant/:tenantID/tunnel/:tunnelID', (req, res) => {

})

router.post('/tenant/:tenantID/dns/A', permissions.isUserInTenant, (req, res) => {
    if(!req.body.name || !req.body.destination || !req.body.destination.match(IPMatch)){
        return res.json({
            status: 401,
            error: "name or destination is missing or invalid IP address in destination."
        })
    }

    DNSController.createARecord(req.params.tenantID, req.body.name, req.body.destination).then((recordID) => {
        return res.json({
            status: 200,
            message: "OK",
            data: {
                recordID
            }
        })
    }).catch((err) => {
        console.error('create tenant a record error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

module.exports = router;