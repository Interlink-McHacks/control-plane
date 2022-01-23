const Setting = require("../models/Setting");

const SettingsController = {};

SettingsController.generateOpenIP = async function() {
   const settings = await Setting.findOne({}).select('assignedIPs');

   if(settings['assignedIPs'].length >= 253){
       throw Error("IP space exhausted.")
   }

   while (true) {
       const num = 2 + Math.floor(Math.random() * 252);

       if(!settings['assignedIPs'].includes(process.env.WG_SUBNET_PREFIX + num)){
           await Setting.updateOne({}, {
               $push: {
                   assignedIPs: process.env.WG_SUBNET_PREFIX + num
               }
           });
           return process.env.WG_SUBNET_PREFIX + num;
       }
   }
}

SettingsController.unregisterIP = async function(ip) {
    await Setting.updateOne({}, {
        $pull: {
            assignedIPs: ip
        }
    })
}

module.exports = SettingsController;