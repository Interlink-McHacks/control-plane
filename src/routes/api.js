const express = require("express");
const router = express.Router();

const UserController = require('../controllers/UserController');
const TenantController = require('../controllers/TenantController');

const permissions = require('../services/permissions');

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

router.get('/tenant/:tenantID', (req, res) => {
    TenantController.getTenant(req.params.tenantID).then((tenant) => {
        return {
            status: 200,
            message: "OK",
            data: tenant
        }
    }).catch((err) => {
        console.error("get tenant error", err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.post('/tenant', (req, res) => {
    if(!req.body.name) {
        return res.status(400).json({
            status: 400,
            error: "No tenant name specified."
        })
    }

    TenantController.createTenant(req.body.name).then((tenant) => {
        return res.json({
            status: 200,
            message: "OK",
            data: {
                id: tenant.id,
                joinToken: tenant.joinToken
            }
        })
    }).catch((err) => {
        console.error('tenant create error', err);
        return res.status(500).json({
            status: 500,
            error: err.message
        })
    })
})

router.post('/tenant/:tenantID/user', (req, res) => {
    if(!req.body.user) {
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

router.delete('/tenant/:tenantID/user/:userID', (req, res) => {
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

router.get('/tunnel/:tunnelID', (req, res) => {

})

router.post('/tunnel', (req, res) => {

})

router.delete('/tunnel/:tunnelID', (req, res) => {

})

router.get('/host/:hostID', (req, res) => {

})

router.post('/host', (req, res) => {

})

router.delete('/host/:hostID', (req, res) => {

})

module.exports = router;