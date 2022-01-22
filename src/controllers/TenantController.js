const short = require('short-uuid');
const Tenant = require('../models/Tenant');
const TenantACL = require('../models/TenantACL');

const TenantController = {};

TenantController.getTenant = function(id) {
    return Tenant.findOne({_id: id});
}

TenantController.createTenant = async function(name) {
    const token = short.generate();
    const tenant = await Tenant.create({
        name: name,
        joinToken: token
    });

    return {
        id: tenant._id.toString(),
        joinToken: tenant.joinToken
    }
}

TenantController.createACL = async function(id, userID) {
    await TenantACL.create({
        tenantID: id,
        userID: userID
    });
}

TenantController.deleteACL = async function(id, userID) {
    await TenantACL.deleteOne({
        tenantID: id,
        userID: userID
    })
}

TenantController.getACLs = async function(id) {
    const acls = await TenantACL.find({
        tenantID: id
    });

    return acls;
}

TenantController.getJoinToken = async function(id) {
    const tenant = await Tenant.findOne({
        _id: id
    }).select('joinToken');

    if(!tenant){
        throw Error("Tenant does not exist.");
    }

    return tenant.joinToken;
}

module.exports = TenantController;