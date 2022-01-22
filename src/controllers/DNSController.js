const DNSAEntry = require('../models/DNSAEntry');

const DNSController = {};

DNSController.createARecord = async function(tenantID, name, destination, description) {
    const entry = await DNSAEntry.create({
        tenantID, name, destination, description
    })

    return entry.id;
}

module.exports = DNSController;