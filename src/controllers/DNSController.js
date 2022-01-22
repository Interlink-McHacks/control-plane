const DNSAEntry = require('../models/DNSAEntry');

const DNSController = {};

DNSController.createARecord = async function(tenantID, name, destination) {
    const entry = await DNSAEntry.create({
        tenantID, name, destination
    })

    return entry.id;
}

module.exports = DNSController;